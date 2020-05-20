module.exports = {
  name: 'ngxs-crud-http',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngxs-crud-http',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
