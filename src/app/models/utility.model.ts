export class Utility {
  static logInPath =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCyJA1fT5zaSdDJXn107YnTGLmQnWeW27E';
  static registerPath =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCyJA1fT5zaSdDJXn107YnTGLmQnWeW27E';
  static localStorageKey = 'user';
  static dataBase = 'Joob';
}
export enum Paths {
  jobsApplications = 'job-applications',
  savedJobs = 'saved-jobs',
  jobsCompany = 'jobs-company',
}
export enum educationFieldsForm {
  university = 'university',
  degree = 'degree',
  fieldOfStudy = 'fieldOfStudy',
  startEducation = 'startEducation',
  endEducation = 'endEducation',
}
export enum workExpirienceFields {
  company = 'company',
  position = 'position',
  start = 'start',
  end = 'end',
}
