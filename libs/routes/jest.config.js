module.exports = {
  name: 'routes',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/routes',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
