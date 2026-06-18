import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeApiService } from './employee-api.service';
import { Employee } from '../../features/employees/models/employee.model';

describe('EmployeeApiService', () => {
  let service: EmployeeApiService;
  let httpMock: HttpTestingController;
  const baseUrl = 'https://task-manager-dd072-default-rtdb.firebaseio.com';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmployeeApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(EmployeeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all employees', () => {
    const mockData = {
      '-abc': { fullName: 'John Doe', email: 'john@example.com', department: 'IT', status: 'Active' as const },
      '-def': { fullName: 'Jane Smith', email: 'jane@example.com', department: 'HR', status: 'Inactive' as const }
    };

    service.getAll().subscribe(employees => {
      expect(employees.length).toBe(2);
      expect(employees[0].id).toBe('-abc');
      expect(employees[0].fullName).toBe('John Doe');
    });

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should return empty array when no employees exist', () => {
    service.getAll().subscribe(employees => {
      expect(employees.length).toBe(0);
    });

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    req.flush(null);
  });

  it('should create an employee', () => {
    const newEmployee = { fullName: 'New Guy', email: 'new@example.com', department: 'Sales', status: 'Active' as const };

    service.create(newEmployee).subscribe(employee => {
      expect(employee.id).toBe('-newid');
      expect(employee.fullName).toBe('New Guy');
    });

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    expect(req.request.method).toBe('POST');
    req.flush({ name: '-newid' });
  });

  it('should update an employee', () => {
    const employee: Employee = { id: '-abc', fullName: 'Updated', email: 'up@example.com', department: 'IT', status: 'Active' };

    service.update(employee).subscribe(result => {
      expect(result.id).toBe('-abc');
      expect(result.fullName).toBe('Updated');
    });

    const req = httpMock.expectOne(`${baseUrl}/employees/-abc.json`);
    expect(req.request.method).toBe('PUT');
    req.flush({ fullName: 'Updated', email: 'up@example.com', department: 'IT', status: 'Active' });
  });

  it('should delete an employee', () => {
    service.delete('-abc').subscribe();

    const req = httpMock.expectOne(`${baseUrl}/employees/-abc.json`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
