export interface BREData {
  dob: Date;
  salary: number;
  pan: string;
  employmentStatus: string;
}

export const runBRE = (data: BREData) => {
  const errors: string[] = [];

  // Age Check: 23 to 50
  const age = calculateAge(data.dob);
  if (age < 23 || age > 50) {
    errors.push('Age must be between 23 and 50');
  }

  // Salary Check: Minimum 25,000
  if (data.salary < 25000) {
    errors.push('Monthly salary must be at least ₹25,000');
  }

  // PAN Check: Valid PAN format (ABCDE1234F)
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!panRegex.test(data.pan)) {
    errors.push('Invalid PAN format');
  }

  // Employment Check: Not Unemployed
  if (data.employmentStatus === 'Unemployed') {
    errors.push('Applicant must be employed (Salaried or Self-Employed)');
  }

  return {
    passed: errors.length === 0,
    errors
  };
};

function calculateAge(dob: Date) {
  const diff = Date.now() - dob.getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}
