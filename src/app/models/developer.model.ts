import { Company } from './company.model';

export interface Developer {
  developerId: string;
  firstName: string;
  lastName: string;
  skills: string[];
  position: string;
  employment: string;
  seniority: string;
  languages: string[];
  education: [
    {
      university: string;
      fieldOfStudy: string;
      degree: string;
      startEducation: number;
      endEducation: number;
    }
  ];
  workExpirience: [
    {
      company: string;
      position: string;
      start: number;
      end: number;
    }
  ];
  savedJobs: string[];
  jobAplications: string[];
  offers: [
    {
      from: string;
      message: string;
      shortedMessage: string;
      companyLink: string;
    }
  ];
  companies: string[];
  coverLetter: string;
  image: string;
  followCompanies: Company[];
}
