import { StatusEnum } from '@common/enums/status.enum';
import { MongooseHelper } from '@common/helpers/mongooseHelper';
import { EmployeeRoleService } from '@modules/employee-role/employee-role.service';
import { EmployeeRole } from '@modules/employee-role/entities/employee-role.entity';
import { IEmployeeRole } from '@modules/employee-role/interface/employee-role.interface';
import { UserTypeEnum } from '@modules/users/enum/index.enum';
import { IUser } from '@modules/users/interfaces/user.interface';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { CreateEmployeeDTOs } from './dto/create-employee.dto';
import { EmployeeService } from './employee.service';
import { Employee } from './entities/employee.entity';
import { IEmployee, IEmployees } from './interfaces/employee.interface';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let model: Model<Employee>;
  let employeeRoleService: EmployeeRoleService;
  // let connection: Connection;
  // mock DTO and variables
  const createEmployeeDTOs: CreateEmployeeDTOs = {
    employees: [
      {
        name: "nusu",
        email: "t3@GMAIL.COM",
        phone: "",
        employeeRoleIds: [MongooseHelper.getInstance().makeMongooseId("65d84a3f3d93b472b2bd9700")]
      }
    ],
  };
  const user: IUser = {
    userId: MongooseHelper.getInstance().makeMongooseId('65d6e59bd2d038abc102b4dc'),
    userType: UserTypeEnum.admin,
    clientId: MongooseHelper.getInstance().makeMongooseId('65d6e54dd2d038abc102b4b2'),
    email: 'pattern50test@gmail.com',
    firstName: 'pattern50',
    lastName: 'test',
    stripeCustomerId: ''
  } as IUser;

  const employeeRoles = [
    {
      name: "DevOps Engineer 20",
      description: "",
      startDate: "2024-02-23T07:33:19.088Z",
      endDate: null,
      status: "active",
      isDeleted: false,
      // created_at: "2024-02-23T07:33:21.069Z",
      // updated_at: "2024-02-29T12:19:42.527Z",

    }
  ]

  const employee: Employee = {
    // id: "65e17add927f8412ba829fe2",
    name: "nusu",
    email: "t3@GMAIL.COM",
    phone: "",
    employeeRoleIds: [
      MongooseHelper.getInstance().makeMongooseId("65d84a3f3d93b472b2bd9700")
    ],
    employeeRoles: employeeRoles,
    startDate: "2024-03-01T06:51:05.895Z",
    status: "active",
    clientId: MongooseHelper.getInstance().makeMongooseId("65d6e54dd2d038abc102b4b2")
  } as any as Employee;
  const employeesForCreate: any = [{
    // id: "65e17add927f8412ba829fe2",
    name: "nusu",
    email: "t3@GMAIL.COM",
    phone: "",
    employeeRoleIds: [
      MongooseHelper.getInstance().makeMongooseId("65d84a3f3d93b472b2bd9700")
    ],
    // employeeRoles: employeeRoles,
    startDate: "2024-03-01T06:51:05.895Z",
    status: "active",
    clientId: MongooseHelper.getInstance().makeMongooseId("65d6e54dd2d038abc102b4b2")
  }];
  const employeeFindOneResponse: any = {
    id: "65e17add927f8412ba829fe2",
    name: "nusu",
    email: "t3@GMAIL.COM",
    phone: "",
    employeeRoleIds: [
      MongooseHelper.getInstance().makeMongooseId("65d84a3f3d93b472b2bd9700")
    ],
    employeeRoles: employeeRoles,
    startDate: "2024-03-01T06:51:05.895Z",
    status: "active",
    clientId: MongooseHelper.getInstance().makeMongooseId("65d6e54dd2d038abc102b4b2")
  };

  const employees: IEmployees = {
    count: 1,
    employees: [employee]
  } as IEmployees;
  const employeesCountWrong: IEmployees = {
    count: 2,
    employees: [employee]
  } as IEmployees;

  const employeeRole: IEmployeeRole = {
    name: "DevOps Engineer 8",
    description: "",
    startDate: "2024-02-23T07:36:05.094Z",
    endDate: null,
    status: StatusEnum.ACTIVE,
    isDeleted: false,
  } as any as IEmployee

  // mock model
  let mockEmployeeModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        EmployeeRoleService,
        {
          provide: getModelToken(Employee.name),
          useValue: {
            create: jest.fn(),
            findByIdAndUpdate: jest.fn(),
          },
        },
        {
          provide: getModelToken(EmployeeRole.name),
          useValue: {
            create: jest.fn(),
          },
        },
        // {
        //   provide: MongooseHelper,
        //   useValue: MongooseHelperMock,
        // },
      ],
    }).compile();

    service = module.get<EmployeeService>(EmployeeService);
    model = module.get<Model<Employee>>(getModelToken(Employee.name));
    employeeRoleService = module.get<EmployeeRoleService>(EmployeeRoleService);
    // connection = module.get<Connection>(Connection);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create employees and return their count', async () => {
      jest.spyOn(service, 'checkEmailUniqueness').mockResolvedValueOnce(null);
      jest.spyOn(employeeRoleService, 'findActiveRole').mockResolvedValueOnce(employeeRole);
      jest.spyOn(model, 'create').mockResolvedValueOnce(employeesForCreate);

      const result = await service.create(createEmployeeDTOs, user);
      expect(result.count).toBeGreaterThan(0);
      expect(result.employees).toHaveLength(result.count);
    });

    it('should throw error if role not found by role id', async () => {
      jest.spyOn(service, 'checkEmailUniqueness').mockResolvedValueOnce(null);
      jest.spyOn(employeeRoleService, 'findActiveRole').mockRejectedValueOnce(new Error('Role not found'));

      await expect(service.create(createEmployeeDTOs, user)).rejects.toThrowError('Role not found');
    });

    it('should throw error if email is duplicate', async () => {
      jest.spyOn(service, 'checkEmailUniqueness').mockRejectedValueOnce(new Error('Email address already exists'));
      jest.spyOn(employeeRoleService, 'findActiveRole').mockResolvedValueOnce(employeeRole);

      await expect(service.create(createEmployeeDTOs, user)).rejects.toThrowError('Email address already exists');
    });
  });
  // describe('update', () => {
  //   it('should update employee and return the employee', async () => {
  //     jest.spyOn(service, 'checkUniqueEmailWithOutItself').mockResolvedValueOnce(null);
  //     jest.spyOn(employeeRoleService, 'findActiveRole').mockResolvedValueOnce(employeeRole);
  //     jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(employee);

  //     const result = await service.update(employee?.id, employee as UpdateEmployeeDto, user);
  //     expect(result).toBe(employee);

  //   });

  // it('should throw error if role not found by role id', async () => {
  //   jest.spyOn(service, 'checkEmailUniqueness').mockResolvedValueOnce(null);
  //   jest.spyOn(employeeRoleService, 'findActiveRole').mockRejectedValueOnce(new Error('Role not found'));
  //   jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(employee);
  //   // Ensure that the create method throws an error
  //   await expect(service.update(employee?.id, employee as UpdateEmployeeDto, user)).rejects.toThrowError('Role not found');
  // });

  // it('should throw error if email is duplicate', async () => {
  //   jest.spyOn(service, 'checkEmailUniqueness').mockRejectedValueOnce(new Error('email must be unique'));
  //   jest.spyOn(employeeRoleService, 'findActiveRole').mockResolvedValueOnce(employeeRole);
  //   jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(employee);
  //   // Ensure that the create method throws an error
  //   await expect(service.update(employee?.id, employee as UpdateEmployeeDto, user)).rejects.toThrowError('email must be unique');
  // });
  // });

  // it('should update an employee and return the updated employee', async () => {
  //   // // Mock data
  //   // const id = 'your_employee_id';
  //   // const updateEmployeeDto: UpdateEmployeeDto = { /* mock update employee DTO */ };
  //   // const user: IUser = { /* mock user */ };
  //   // const updatedEmployee: Employee = { /* mock updated employee object */ };

  //   // Mock the behavior of dependencies
  //   // jest.spyOn(mockConstructObjectFromDtoHelper, 'constructEmployeeUpdateObj').mockReturnValueOnce(/* mock employee DTO */);
  //   jest.spyOn(service, 'checkUniqueEmailWithOutItself').mockResolvedValueOnce(null);
  //   jest.spyOn(employeeRoleService, 'findActiveRole').mockResolvedValueOnce(employeeRole);
  //   jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce(employee);

  //   // Call the update method
  //   const result = await service.update(employee?.id, employee as UpdateEmployeeDto, user);

  //   // Assertions
  //   expect(result).toEqual(employee); // Ensure that the result is the updated employee

  //   // Ensure that findByIdAndUpdate was called with the correct arguments
  //   expect(model.findByIdAndUpdate).toHaveBeenCalledWith(employee?.id, expect.any(Object), { new: true });

  //   // Ensure that other methods were not called
  //   // expect(mockExceptionHelper.defaultError).not.toHaveBeenCalled();
  //   expect(employeeRoleService.findActiveRole).not.toHaveBeenCalled();
  // });


  describe('updateStatus', () => {
    it('should update employee status and return the updated employee', async () => {
      // Mock data
      const updateEmployeeStatus = { status: StatusEnum.INACTIVE };
      // Mock findOne method
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(employeeFindOneResponse);
      // Mock findByIdAndUpdate method
      jest.spyOn(model, 'findByIdAndUpdate').mockResolvedValueOnce({ ...employeeFindOneResponse, status: StatusEnum.INACTIVE });

      // Call the method being tested
      const result = await service.updateStatus(employeeFindOneResponse.id, updateEmployeeStatus);

      // Assert the result
      expect(result.id).toBe(employeeFindOneResponse.id);
      expect(result.status).toBe(StatusEnum.INACTIVE);
    });

    it('should throw an error if employee status is already the same', async () => {
      const updateEmployeeStatus = { status: StatusEnum.ACTIVE };
      // Mock findOne method to return an employee with the same status
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(employeeFindOneResponse);

      // Call the method being tested and expect it to throw an error
      await expect(service.updateStatus(employeeFindOneResponse.id, updateEmployeeStatus)).rejects.toThrowError(`Employee already ${updateEmployeeStatus.status}`);
    });

  });

  describe('findOne', () => {
    it('should mock isValidMongooseId', () => {
      // Setup: Call the mocked method with a sample ID
      const id = '65e17add927f8412ba829fe2';
      const isValid = MongooseHelper.getInstance().isValidMongooseId(id);
      expect(isValid).toBe(undefined)
    });
    it('should throw if id is invalid', () => {
      // Setup: Call the mocked method with a sample ID
      const id = 'invalid-id';
      const isValid = MongooseHelper.getInstance().isValidMongooseId(id);
      expect(isValid).rejects.toThrowError()
    });
    it('should update one employee', () => {

    })
  })

});
