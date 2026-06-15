import { expect, Locator, Page } from '@playwright/test';
import type { SubjectData } from '../types/subject-data';

export class SubjectsPage {
  private readonly page: Page;
  private readonly subjectsHeading: Locator;
  private readonly firstSubjectMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.subjectsHeading = page.locator('#lblHeading');
    this.firstSubjectMenuButton = page.locator('a[title="Menu"].fa-gen.menu').first();
  }

  async expectSubjectsPageLoaded(): Promise<void> {
    await expect(this.subjectsHeading).toHaveText(/subjects/i);
  }

  async openFirstSubjectTasksPopup(): Promise<Page> {
    await this.expectSubjectsPageLoaded();

    await expect(this.firstSubjectMenuButton).toBeVisible();

    const [tasksPopup] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.firstSubjectMenuButton.click(),
    ]);

    await tasksPopup.waitForLoadState('domcontentloaded');

    await expect(tasksPopup.locator('#lnkView2')).toBeVisible();

    return tasksPopup;
  }

  async openViewInformationPopup(tasksPopup: Page): Promise<Page> {
    const viewInformationLink = tasksPopup.locator('#lnkView2');

    await expect(viewInformationLink).toBeVisible();

    const [subjectInfoPopup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      viewInformationLink.click(),
    ]);

    await subjectInfoPopup.waitForLoadState('domcontentloaded');

    await expect(subjectInfoPopup.locator('#txtScreen')).toBeVisible();

    return subjectInfoPopup;
  }

  async captureSubjectInformation(subjectInfoPopup: Page): Promise<SubjectData> {
    const subjectIdLocator = subjectInfoPopup.locator('#txtScreen');
    const sexGenderLocator = subjectInfoPopup.locator('#lstGender');
    const cohortLocator = subjectInfoPopup.locator('#lstCohort');
    const statusLocator = subjectInfoPopup.locator('#lstLastActivity');

    await expect(subjectIdLocator).toBeVisible();
    await expect(sexGenderLocator).toBeVisible();
    await expect(cohortLocator).toBeVisible();
    await expect(statusLocator).toBeVisible();

    const subjectData: SubjectData = {
      subjectId: (await subjectIdLocator.innerText()).trim(),
      sexGender: (await sexGenderLocator.innerText()).trim(),
      cohort: (await cohortLocator.innerText()).trim(),
      status: (await statusLocator.innerText()).trim(),
    };

    expect(subjectData.subjectId).not.toBe('');
    expect(subjectData.sexGender).not.toBe('');
    expect(subjectData.cohort).not.toBe('');
    expect(subjectData.status).not.toBe('');

    return subjectData;
  }

  async openAndCaptureFirstSubjectInformation(): Promise<SubjectData> {
    const tasksPopup = await this.openFirstSubjectTasksPopup();

    const subjectInfoPopup = await this.openViewInformationPopup(tasksPopup);

    return this.captureSubjectInformation(subjectInfoPopup);
  }
}