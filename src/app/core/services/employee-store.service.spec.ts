import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeStoreService } from './employee-store.service';

describe('EmployeeStoreService', () => {
  let service: EmployeeStoreService;
  let httpMock: HttpTestingController;
  let snackBarSpy: { open: ReturnType<typeof vi.fn> };
  const baseUrl = 'https://task-manager-dd072-default-rtdb.firebaseio.com';

  beforeEach(() => {
    snackBarSpy = { open: vi.fn() };

    TestBed.configureTestingModule({
      providers: [
        EmployeeStoreService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });
    service = TestBed.inject(EmployeeStoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial loading state as false', () => {
    expect(service.loading()).toBe(false);
  });

  it('should have initial empty filtered employees', () => {
    expect(service.filteredEmployees()).toEqual([]);
  });

  it('should load employees from Firebase', async () => {
    const loadPromise = service.loadEmployees();

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    req.flush({
      '-abc': { fullName: 'Alice', email: 'alice@example.com', department: 'IT', status: 'Active' }
    });

    await loadPromise;
    expect(service.filteredEmployees().length).toBe(1);
    expect(service.filteredEmployees()[0].fullName).toBe('Alice');
  });

  it('should filter employees by search term', async () => {
    const loadPromise = service.loadEmployees();

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    req.flush({
      '-a': { fullName: 'Alice', email: 'a@example.com', department: 'IT', status: 'Active' },
      '-b': { fullName: 'Bob', email: 'b@example.com', department: 'HR', status: 'Active' }
    });

    await loadPromise;
    service.setSearchTerm('alice');
    expect(service.filteredEmployees().length).toBe(1);
    expect(service.filteredEmployees()[0].fullName).toBe('Alice');
  });

  it('should filter employees by status', async () => {
    const loadPromise = service.loadEmployees();

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    req.flush({
      '-a': { fullName: 'Alice', email: 'a@example.com', department: 'IT', status: 'Active' },
      '-b': { fullName: 'Bob', email: 'b@example.com', department: 'HR', status: 'Inactive' }
    });

    await loadPromise;
    service.setStatusFilter('Inactive');
    expect(service.filteredEmployees().length).toBe(1);
    expect(service.filteredEmployees()[0].fullName).toBe('Bob');
  });

  it('should sort employees by name descending', async () => {
    const loadPromise = service.loadEmployees();

    const req = httpMock.expectOne(`${baseUrl}/employees.json`);
    req.flush({
      '-a': { fullName: 'Alice', email: 'a@example.com', department: 'IT', status: 'Active' },
      '-b': { fullName: 'Bob', email: 'b@example.com', department: 'HR', status: 'Active' }
    });

    await loadPromise;
    service.setSortDirection('desc');
    expect(service.filteredEmployees()[0].fullName).toBe('Bob');
    expect(service.filteredEmployees()[1].fullName).toBe('Alice');
  });

  it('should add an employee', async () => {
    // First load
    const loadPromise = service.loadEmployees();
    const getReq = httpMock.expectOne(`${baseUrl}/employees.json`);
    getReq.flush({});
    await loadPromise;

    const addPromise = service.addEmployee({
      fullName: 'Charlie',
      email: 'charlie@example.com',
      department: 'Finance',
      status: 'Active'
    });

    const postReq = httpMock.expectOne(`${baseUrl}/employees.json`);
    expect(postReq.request.method).toBe('POST');
    postReq.flush({ name: '-charlie' });

    const result = await addPromise;
    expect(result).toBe(true);
    expect(service.filteredEmployees().length).toBe(1);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Employee added successfully', 'Close', expect.any(Object));
  });

  it('should delete an employee', async () => {
    const loadPromise = service.loadEmployees();
    const getReq = httpMock.expectOne(`${baseUrl}/employees.json`);
    getReq.flush({
      '-abc': { fullName: 'Alice', email: 'a@example.com', department: 'IT', status: 'Active' }
    });
    await loadPromise;

    const deletePromise = service.deleteEmployee('-abc');
    const deleteReq = httpMock.expectOne(`${baseUrl}/employees/-abc.json`);
    expect(deleteReq.request.method).toBe('DELETE');
    deleteReq.flush(null);

    const result = await deletePromise;
    expect(result).toBe(true);
    expect(service.filteredEmployees().length).toBe(0);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Employee deleted successfully', 'Close', expect.any(Object));
  });
});
