const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register Handlebars helpers
Handlebars.registerHelper('formatDate', function(dateString) {
  if (!dateString) return 'Present';
  
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
});

Handlebars.registerHelper('eq', function(a, b) {
  return a === b;
});

Handlebars.registerHelper('section', function(items) {
  return items && items.length > 0;
});

Handlebars.registerHelper('newlineToBr', function(text) {
  if (!text) return '';
  // Escape HTML to prevent injection, then replace newlines with <br>
  const escaped = Handlebars.Utils.escapeExpression(text);
  return new Handlebars.SafeString(escaped.replace(/\n/g, '<br>'));
});

function render(resume) {
  const templatePath = path.join(__dirname, 'resume.hbs');
  const cssPath = path.join(__dirname, 'style.css');
  
  const template = fs.readFileSync(templatePath, 'utf-8');
  const css = fs.readFileSync(cssPath, 'utf-8');
  
  const compiledTemplate = Handlebars.compile(template);
  
  // Add CSS to resume data
  const data = {
    ...resume,
    css: css
  };
  
  return compiledTemplate(data);
}

module.exports = {
  render: render
};
