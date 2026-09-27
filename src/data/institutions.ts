import { Institution } from '../types';

export const INSTITUTIONS: Institution[] = [
  {
    id: 'mits-gwalior',
    name: 'Madhav Institute of Technology & Science',
    shortName: 'MITS Gwalior',
    emailDomains: ['mitsgwl.ac.in'],
    city: 'Gwalior',
    state: 'Madhya Pradesh',
    type: 'Engineering',
    status: 'active',
    description: 'NAAC A+ Accredited | Autonomous Institute | Est. 1957',
    studentCount: '5000+',
  },
  // Structure supports adding more institutions later:
  // {
  //   id: 'iit-delhi',
  //   name: 'Indian Institute of Technology Delhi',
  //   shortName: 'IIT Delhi',
  //   emailDomains: ['iitd.ac.in'],
  //   city: 'New Delhi',
  //   state: 'Delhi',
  //   type: 'Engineering',
  //   status: 'upcoming',
  //   description: 'Premier Engineering Institute',
  //   studentCount: '10000+',
  // },
];

export function getInstitutionById(id: string): Institution | undefined {
  return INSTITUTIONS.find((i) => i.id === id);
}

export function getActiveInstitutions(): Institution[] {
  return INSTITUTIONS.filter((i) => i.status === 'active');
}

export function validateInstitutionEmail(email: string, institutionId: string): boolean {
  const institution = getInstitutionById(institutionId);
  if (!institution) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return false;
  return institution.emailDomains.includes(domain);
}

export function getInstitutionByEmailDomain(email: string): Institution | undefined {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return undefined;
  return INSTITUTIONS.find((i) => i.emailDomains.includes(domain));
}
