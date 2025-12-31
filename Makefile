.PHONY: help

MAKEFLAGS += --silent
.DEFAULT_GOAL := help

help: ## Show help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

setup: ## Setup development environment
	@echo "Setting up development environment..."
	@npm install --prefix resume/theme
	@for packageFile in ./.github/actions/**/package.json; do \
		dir=$$(dirname "$$packageFile"); \
		npm install --prefix "$$dir"; \
	done
	@echo "Development environment setup complete."

lint: ## Execute linting
	$(call run_linter,)

lint-fix: ## Execute linting and fix
	$(MAKE) humanize-resume
	$(call run_linter, \
		-e FIX_JSON_PRETTIER=true \
		-e FIX_JAVASCRIPT_PRETTIER=true \
		-e FIX_YAML_PRETTIER=true \
		-e FIX_MARKDOWN=true \
		-e FIX_MARKDOWN_PRETTIER=true \
		-e FIX_NATURAL_LANGUAGE=true\
		-e FIX_HTML_PRETTIER=true\
		-e FIX_CSS=true\
		-e FIX_CSS_PRETTIER=true\
		-e FIX_JSX_PRETTIER=true\
		-e FIX_TYPESCRIPT_PRETTIER=true\
	)

audit-fix: ## Audit and fix npm packages
	@echo "Auditing and fixing npm packages in resume/theme..."
	@cd resume/theme && npm audit fix
	@echo "Auditing and fixing npm packages in GitHub Actions..."
	@for packageFile in ./.github/actions/**/package.json; do \
		dir=$$(dirname "$$packageFile"); \
		echo "Auditing and fixing npm packages in $$dir..."; \
		npm audit fix --prefix "$$dir"; \
	done
	@echo "NPM package audit and fix complete."

test: ## Run tests
	@echo "Running tests..."
	@cd resume/theme && npm install && npm test	

humanize-resume: ## Normalize resume text with humanize-ai-lib
	@echo "Discovering resume files..."
	@RESUME_FILES=$$(node .github/actions/get-available-resumes/get-available-resumes.js | jq -r '.[].path'); \
	cd .github/actions/humanize-resume && \
	npm install && \
	npm run humanize -- $$RESUME_FILES

preview-resume: ## Preview resume in the browser
	@cd resume/theme && \
	npm install && npm run dev

validate-resume: ## Validate resume JSON files
	@echo "Discovering and validating resume files..."
	@node .github/actions/get-available-resumes/get-available-resumes.js | jq -r '.[].path' | while read -r resume; do \
		echo "Validating $$resume..."; \
		cd ./.github/actions/validate-resume && npm install > /dev/null 2>&1 && npm run validate -- "$$resume" || exit 1; \
		cd - > /dev/null; \
	done

generate-pdfs: ## Generate all resumes PDFs
	@echo "Building theme..."
	@cd resume/theme && npm install > /dev/null 2>&1 && npm run build > /dev/null
	@echo "Discovering and generating PDFs for all resume files..."
	@cd ./.github/actions/generate-resume-pdf && npm install > /dev/null 2>&1
	@node .github/actions/get-available-resumes/get-available-resumes.js | jq -c '.[]' | while read -r resume; do \
		RESUME_NAME=$$(echo "$$resume" | jq -r '.name'); \
		RESUME_PATH=$$(echo "$$resume" | jq -r '.path'); \
		PDF_PATH=$$(echo "$$resume" | jq -r '.["pdf-path"]'); \
		echo "Generating PDF for $$RESUME_NAME..."; \
		cd ./.github/actions/generate-resume-pdf && npm run generate-pdf -- "$$RESUME_PATH" "$$PDF_PATH" || exit 1; \
		cd - > /dev/null; \
	done

ci: ## Run all CI tasks
	$(MAKE) setup
	$(MAKE) lint-fix
	$(MAKE) test
	$(MAKE) validate-resume
	$(MAKE) generate-pdfs

define run_linter
	DEFAULT_WORKSPACE="$(CURDIR)"; \
	LINTER_IMAGE="linter:latest"; \
	VOLUME="$$DEFAULT_WORKSPACE:$$DEFAULT_WORKSPACE"; \
	docker build --build-arg UID=$(shell id -u) --build-arg GID=$(shell id -g) --tag $$LINTER_IMAGE .; \
	docker run \
		-e DEFAULT_WORKSPACE="$$DEFAULT_WORKSPACE" \
		-e FILTER_REGEX_INCLUDE="$(filter-out $@,$(MAKECMDGOALS))" \
		-e IGNORE_GITIGNORED_FILES=true \
		$(1) \
		-v $$VOLUME \
		--rm \
		$$LINTER_IMAGE
endef

#############################
# Argument fix workaround
#############################
%:
	@:
