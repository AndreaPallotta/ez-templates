const degit = require('degit');

// module.exports = (templateName) => {
//     const emitter = degit('AndreaPallotta/Templates')
// }

const emitter = degit('AndreaPallotta/Templates', {
  cache: true,
  force: true,
  verbose: true,
});


emitter.clone(process.cwd()).then(() => {
    console.log('done')
})