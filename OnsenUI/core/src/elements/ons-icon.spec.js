'use strict';

describe('OnsIconElement', () => {
  it('should exist', () => {
    expect(window.ons.elements.Icon).to.be.ok;
  });

  describe('icon attribute', () => {
    it('provides \'icon\' attribute', () => {
      var element = new ons.elements.Icon();
      element.setAttribute('icon', 'ion-navicon');
      expect(element.classList.contains('ion-navicon')).to.be.true;

      element.setAttribute('icon', 'fa-twitter');
      expect(element.classList.contains('fa-twitter')).to.be.true;
      expect(element.classList.contains('ion-navicon')).not.to.be.true;

      element.setAttribute('icon', 'i-dont-exist');
      expect(element.classList.contains('i-dont-exist')).not.to.be.true;
      expect(element.classList.contains('fa-twitter')).not.to.be.true;

      element.setAttribute('icon', 'md-face');
      expect(element.classList.contains('zmdi-face')).to.be.true;
      expect(element.classList.contains('zmdi')).to.be.true;

      element.setAttribute('icon', 'ion-navicon');
      expect(element.classList.contains('zmdi-face')).not.to.be.true;
      expect(element.classList.contains('zmdi')).not.to.be.true;
    });

    it('toggles autoPrefix', () => {
      var element = new ons.elements.Icon();
      element.setAttribute('icon', 'my-custom-icon');
      expect(element.classList.contains('my')).not.to.be.true;
      expect(element.classList.contains('my-custom-icon')).not.to.be.true;
      expect(element.classList.contains('fa')).to.be.true;
      expect(element.classList.contains('fa-my-custom-icon')).to.be.true;

      ons.elements.Icon.setAutoPrefix(false);
      element.setAttribute('icon', 'customicon');
      expect(element.classList.contains('customicon')).to.be.true;
      expect(element.classList.contains('fa')).not.to.be.true;
      expect(element.classList.contains('fa-customicon')).not.to.be.true;

      element.setAttribute('icon', 'my-custom-icon');
      expect(element.classList.contains('my')).to.be.true;
      expect(element.classList.contains('my-custom-icon')).to.be.true;
      expect(element.classList.contains('customicon')).not.to.be.true;
      expect(element.classList.contains('fa')).not.to.be.true;
      expect(element.classList.contains('fa-my-custom-icon')).not.to.be.true;

      element.setAttribute('icon', 'other-custom-icon');
      expect(element.classList.contains('my')).not.to.be.true;
      expect(element.classList.contains('my-custom-icon')).not.to.be.true;
      expect(element.classList.contains('other')).to.be.true;
      expect(element.classList.contains('other-custom-icon')).to.be.true;

      element.setAttribute('icon', 'ios-icon, material:android-icon');
      expect(element.classList.contains('ios')).to.be.true;
      expect(element.classList.contains('ios-icon')).to.be.true;
      expect(element.classList.contains('android')).not.to.be.true;
      expect(element.classList.contains('android-icon')).not.to.be.true;
      element.setAttribute('modifier', 'material');
      expect(element.classList.contains('ios')).not.to.be.true;
      expect(element.classList.contains('ios-icon')).not.to.be.true;
      expect(element.classList.contains('android')).to.be.true;
      expect(element.classList.contains('android-icon')).to.be.true;

      ons.elements.Icon.setAutoPrefix(true);
    });

    it('supports a second icon depending on modifiers', () => {
      var element = new ons.elements.Icon();
      element.setAttribute('icon', 'ion-navicon, material:md-face');
      expect(element.classList.contains('ion-navicon')).to.be.true;
      expect(element.classList.contains('zmdi-face')).not.to.be.true;

      ons.platform.select('android');
      element = new ons.elements.Icon();
      element.setAttribute('icon', 'ion-navicon, material:md-face');
      expect(element.classList.contains('ion-navicon')).not.to.be.true;
      expect(element.classList.contains('zmdi-face')).to.be.true;
      ons.platform.select('');
    });
  });

  describe('size attribute', () => {
    it('provides \'size\' attribute', () => {
      var element = new ons.elements.Icon();
      element.setAttribute('size', '10px');
      expect(element.style.fontSize).to.equal('10px');

      element.setAttribute('size', '20%');
      expect(element.style.fontSize).to.equal('20%');
      expect(element.style.fontSize).not.to.equal('10px');

      element.setAttribute('size', 'lg');
      expect(element.style.fontSize).not.be.ok;
      expect(element.classList.contains('ons-icon--lg')).to.be.true;

      element.setAttribute('size', '5x');
      expect(element.style.fontSize).not.be.ok;
      expect(element.classList.contains('ons-icon--5x')).to.be.true;
      expect(element.classList.contains('ons-icon--lg')).not.to.be.true;

      element.setAttribute('size', '6x');
      expect(element.classList.contains('ons-icon--6x')).not.to.be.true;
      expect(element.classList.contains('ons-icon--5x')).not.to.be.true;
    });

    it('supports a second size depending on modifiers', () => {
      var element = new ons.elements.Icon();
      element.setAttribute('size', '20px, material:30px');
      expect(element.style.fontSize).to.equal('20px');

      ons.platform.select('android');
      element = new ons.elements.Icon();
      element.setAttribute('size', '20px, material:30px');
      expect(element.style.fontSize).to.equal('30px');
      ons.platform.select('');
    });
  });

  describe('#_compile()', () => {
    it('does not compile twice', () => {
      const div1 = document.createElement('div');
      const div2 = document.createElement('div');
      div1.innerHTML = '<ons-icon icon="fa-twitter" size="10px"></ons-icon>';
      div2.innerHTML = div1.innerHTML;
      expect(div1.isEqualNode(div2)).to.be.true;
    });
  });
});
