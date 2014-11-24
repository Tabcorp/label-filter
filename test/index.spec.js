var Filter = require('../lib/index');

describe('filter', function() {

  describe('is', function() {

    it('matches everything if no filter is passed', function() {
      new Filter().match(['something']).should.eql(true);
      new Filter('').match(['something']).should.eql(true);
    });

    it('does not match if the tag is missing', function() {
      var filter = new Filter('is:frontend');
      filter.match(['backend']).should.eql(false);
    });

    it('matches a single tag', function() {
      var filter = new Filter('is:frontend');
      filter.match(['frontend', 'backend']).should.eql(true);
    });

    it('matches from a list of tags (or)', function() {
      var filter = new Filter('is:frontend is:backend');
      filter.match(['frontend', 'cool']).should.eql(true);
    });

    it('matches multiple tags (and)', function() {
      var filter = new Filter('is:frontend+fast');
      filter.match(['frontend', 'backend', 'fast']).should.eql(true);
    });

    it('does not match multiple tags if any of them is missing', function() {
      var filter = new Filter('is:frontend+fast');
      filter.match(['frontend', 'slow']).should.eql(false);
    });

  });

  describe('not', function() {

    it('matches if the tag is absent', function() {
      var filter = new Filter('not:frontend');
      filter.match(['backend', 'fast']).should.eql(true);
    });

    it('does not matches if the tag is present', function() {
      var filter = new Filter('not:frontend');
      filter.match(['frontend', 'fast']).should.eql(false);
    });

    it('does not match if any of the tags are present (or)', function() {
      var filter = new Filter('not:frontend not:slow');
      filter.match(['frontend']).should.eql(false);
    });

    it('does not match if all the tags are present (and)', function() {
      var filter = new Filter('not:frontend+slow');
      filter.match(['frontend', 'slow']).should.eql(false);
    });

    it('matches if some required tags are missing', function() {
      var filter = new Filter('not:frontend+fast');
      filter.match(['frontend', 'slow']).should.eql(true);
    });

  });

  describe('combination', function() {

    it('can combine is and not', function() {
      var filter = new Filter('is:backend is:network not:integration+slow');
      filter.match(['backend', 'slow']).should.eql(true);
      filter.match(['network', 'integration']).should.eql(true);
      filter.match(['backend', 'integration', 'fast']).should.eql(true);
      filter.match(['backend', 'integration', 'slow']).should.eql(false);
      filter.match(['frontend', 'integration', 'slow']).should.eql(false);
    });

  });

  it('pretty-prints the filter', function() {
    new Filter().toString().should.eql('');
    new Filter('is:backend not:slow').toString().should.eql('is:backend not:slow');
  });

  it('can dynamically add to the filter', function() {
    var filter = new Filter('is:backend not:slow');
    filter.match(['backend', 'daytime']).should.eql(true);
    filter.add('not:daytime');
    filter.toString().should.eql('is:backend not:slow not:daytime');
    filter.match(['backend', 'daytime']).should.eql(false);
  });

  it('can dynamically remove from the filter', function() {
    var filter = new Filter('is:backend not:slow');
    filter.match(['backend', 'slow']).should.eql(false);
    filter.remove('not:slow');
    filter.toString().should.eql('is:backend');
    filter.match(['backend', 'slow']).should.eql(true);
  });

});
