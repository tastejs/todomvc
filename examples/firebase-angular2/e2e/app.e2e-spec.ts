import { FirebaseAngular2Page } from './app.po';

describe('firebase-angular2 App', () => {
  let page: FirebaseAngular2Page;

  beforeEach(() => {
    page = new FirebaseAngular2Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
