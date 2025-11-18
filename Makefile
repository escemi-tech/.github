.PHONY: help

MAKEFLAGS += --silent
.DEFAULT_GOAL := help

help: ## Show help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m\033[0m\n"} /^[$$()% a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

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

humanize-resume: ## Normalize resume text with humanize-ai-lib
	@cd .github/actions/humanize-resume && \
	npm install && \
	npm run humanize -- ../../../resume/resume.en.json ../../../resume/resume.fr.json


preview-resume: ## Preview resume in the browser
	@cd resume/themes/escemi && \
	npm install && npm start

validate-resume: ## Validate resume JSON files
	@cd ./.github/actions/validate-resume && \
	npm install && \
	npm run validate -- ../../../resume/resume.en.json && \
	npm run validate -- ../../../resume/resume.fr.json

generate-pdfs: ## Generate all resumes PDFs
	@cd resume/themes/escemi && \
	npm install && npm run build
	@cd ./.github/actions/generate-resume-pdf && \
	npm install && \
	npm run generate-pdf -- ../../../resume/resume.en.json ../../../resume/pdf/resume.en.pdf && \
	npm run generate-pdf -- ../../../resume/resume.fr.json ../../../resume/pdf/resume.fr.pdf


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
