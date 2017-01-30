

describe('test', function() {
	it('should be true', function() {
		document.body.innerHTML = 'hello';
		expect(document.body.textContent).to.be.equal('hello')
	});
});
