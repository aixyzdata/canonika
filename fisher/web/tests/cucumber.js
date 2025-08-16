module.exports = {
  default: {
    requireModule: ['@babel/register'],
    require: ['steps/*.js'],
    format: ['progress-bar', 'html:cucumber-report.html'],
    formatOptions: { snippetInterface: 'async-await' }
  }
}; 