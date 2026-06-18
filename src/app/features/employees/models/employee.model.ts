export interface Employee {
  id: string;
  fullName: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive';
}

export interface NewEmployee {
  fullName: string;
  email: string;
  department: string;
  status: 'Active' | 'Inactive';
}
