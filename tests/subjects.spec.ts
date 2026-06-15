import { test, expect } from '../fixtures/test-fixtures';
import { SubjectsPage } from '../pages/SubjectsPage';
import { DbHelper } from '../utils/db-helper';

test('capture first subject information and validate database record', async ({
  loggedInPage,
}) => {
  const subjectsPage = new SubjectsPage(loggedInPage);
  const dbHelper = new DbHelper();

  await dbHelper.clearSubjectResults();

  const uiSubjectData = await subjectsPage.openAndCaptureFirstSubjectInformation();

  await dbHelper.insertSubjectResult(uiSubjectData);

  const dbSubjectData = await dbHelper.getSubjectResultBySubjectId(
    uiSubjectData.subjectId

  );
  

  console.log('UI subject data:', uiSubjectData);
  console.log('DB subject data:', dbSubjectData);

  expect(dbSubjectData).toEqual(uiSubjectData);
});