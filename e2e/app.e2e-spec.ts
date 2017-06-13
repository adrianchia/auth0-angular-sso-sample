import { HelloPage } from './app.po';

describe('hello App', () => {
  let page: HelloPage;

  beforeEach(() => {
    page = new HelloPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
