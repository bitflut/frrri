module.exports = {
  name: 'ngxs-crud-legacy',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ngxs-crud-legacy',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
