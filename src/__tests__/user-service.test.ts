import { UserService } from '../services/user-service';
import { User } from '../models/user';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, AuthenticationError, ResourcePersistenceError } from '../errors/errors';
import validator from '../util/validator';

jest.mock('../repos/user-repo', () => {
    
    return new class UserRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getUserByUniqueKey = jest.fn();
            getUserByCredentials = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    };

});
describe('userService', () => {

    let sut: UserService;
    let mockRepo;

    let mockUsers = [
        new User(1, 'aanderson', 'password', 'Alice'),
        new User(2, 'bbailey', 'password', 'Bob'),
        new User(3, 'ccountryman', 'password', 'Charlie'),
        new User(4, 'ddavis', 'password', 'Daniel'),
        new User(5, 'eeinstein', 'password', 'Emily')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getUserByUniqueKey: jest.fn(),
                getUserByCredentials: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            };
        });

        // @ts-ignore
        sut = new UserService(mockRepo);
    
    });

    test('should resolve to User[] (without passwords) when getAllUsers() successfully retrieves users from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockUsers);

        // Act
        let result = await sut.getAllUsers();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);
        result.forEach(val => expect(val.password).toBeUndefined());

    });

    test('should reject with ResourceNotFoundError when getAllUsers fails to get any users from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllUsers();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<User>((resolve) => resolve(mockUsers[id - 1]));
        });


        // Act
        let result = await sut.getUserById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.id).toBe(1);
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getUserById(-2);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError if getByid is given an unknown id', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(true);

        // Act
        try {
            await sut.getUserById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when getUserByUniqueKey is given a valid a known Object', async () => {

        // Arrange
        expect.assertions(3);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});

        validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);

        mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
            return new Promise<User>((resolve) => {
                resolve(mockUsers.find(user => user[key] === val));
            });
        });



        // Act
        let result = await sut.getUserByUniqueKey({'username': 'aanderson'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('aanderson');
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when getUserByUniqueKey is given a invalid value as an Object(empty string)', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            validator.isPropertyOf = jest.fn().mockReturnValue(false);
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            await sut.getUserByUniqueKey('');
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getUserByUniqueKey is given a invalid value as an Object({"username":""})', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            validator.isPropertyOf = jest.fn().mockReturnValue(true);
            Validator.isValidStrings = jest.fn().mockReturnValue(false);
            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
                return new Promise<User>((resolve) => {
                    resolve(mockUsers.find(user => user[key] === val));
                });
            });
        
            await sut.getUserByUniqueKey({'username': ''});
        } catch (e) {

            // Assert
            
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError when getUserByUniqueKey return an empty object', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            validator.isPropertyOf = jest.fn().mockReturnValue(true);
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            Validator.isEmptyObject = jest.fn().mockReturnValue(true);
            mockRepo.getUserByUniqueKey = jest.fn().mockImplementation(() => {
                return new Promise<User>((resolve) => {
                    resolve({} as User);
                });
            });
            await sut.getUserByUniqueKey({'username': 'x'});
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to User when authenticateUser is given a valid a known username and password', async () => {

        // Arrange
        expect.assertions(3);
        
        Validator.isValidStrings = jest.fn().mockReturnValue(true);

        mockRepo.getUserByCredentials = jest.fn().mockImplementation((un: string, pw: string) => {
            return new Promise<User>((resolve) => {
                resolve(mockUsers.find(user => user['username'] === un && user['password'] === pw ));
            });
        });

        // Act
        let result = await sut.authenticateUser('aanderson', 'password');

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('aanderson');
        expect(result.password).toBeUndefined();

    });

    test('should reject with BadRequestError when authenticateUser is given an invalid value ("","")', async () => {

        // Arrange
        expect.assertions(1);
        
        //Act
        try {
            
            Validator.isValidStrings = jest.fn().mockReturnValue(false);
            

            await sut.authenticateUser('', '');
        } catch (e) {
    
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with AuthenticationError when authenticateUser results in an empty object', async () => {

        // Arrange
        expect.assertions(1);
        
        //Act
        try {
            
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            mockRepo.getUserByCredentials = jest.fn().mockImplementation(() => {
                return new Promise<User>((resolve) => {
                    resolve({} as User);
                });
            });
            await sut.authenticateUser('aanderson','password');
        } catch (e) {
    
            // Assert
            expect(e instanceof AuthenticationError).toBe(true);
        }

    });

    test('should resolve to User when addNewUser is given a valid a known User', async () => {

        // Arrange
        expect.assertions(3);
        


        validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });

        sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
        sut.isAccountAvailable = jest.fn().mockReturnValue(true);

        // Act
        let result = await sut.addNewUser(new User(1, 'aanderson', 'password', 'Alice'));

        // Assert
        expect(result).toBeTruthy();
        expect(result.username).toBe('aanderson');
        expect(result.password).toBeUndefined();

    });

    test('should ResourcePersistenceError when addNewUser is given an unavailable username', async () => {

        // Arrange
        expect.assertions(1);
        

        



        // Act
        try{
            validator.isValidObject = jest.fn().mockReturnValue(true);


            sut.isUsernameAvailable = jest.fn().mockReturnValue(false);
            sut.isAccountAvailable = jest.fn().mockReturnValue(true);

            await sut.addNewUser(new User(1, 'aanderson', 'password', 'Alice'));
        }
        catch(e){
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

        // Assert
        

    });

    test('should ResourcePersistenceError when addNewUser is given an unavailable account name', async () => {

        // Arrange
        expect.assertions(1);
        


        validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });



        // Act
        try{
            sut.isUsernameAvailable = jest.fn().mockReturnValue(true);
            sut.isAccountAvailable = jest.fn().mockReturnValue(false);
            
            await sut.addNewUser(new User(1, 'xtx', 'password', 'Alice'));
        }
        catch(e){
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

        // Assert
        

    });

    test('should reject to BadRequestError when addNewUser is given an invalid User(testing private isUsernameAvailable method)', async () => {

        // Arrange
        expect.assertions(1);
        


        validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });
        

        // Act
        try{

        
            await sut.addNewUser(new User(1, '', 'x', 'x'));
        }
        // Assert
        catch(e){
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject to BadRequestError when addNewUser is given an invalid User(testing private isAccountAvailable method)', async () => {

        // Arrange
        expect.assertions(1);
        


        validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });



        // Act
        try{
            await sut.addNewUser(new User(1, 'x', 'x', ''));
        }
        // Assert
        catch(e){
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should reject to BadRequestError when addNewUser is given an invalid User', async () => {

        // Arrange
        expect.assertions(1);
        


        validator.isValidObject = jest.fn().mockReturnValue(false);

        mockRepo.save = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });



        // Act
        try{
            await sut.addNewUser(new User(0, 'x', 'x', ''));
        }
        // Assert
        catch(e){
            expect(e instanceof BadRequestError).toBe(true);
        }
    });

    test('should resolve true when updateUser is given a valid a known User', async () => {

        // Arrange
        expect.assertions(1);
        let updatedUser = {'username':'aanderson', 'password':'password', 'account_name':'Alice'};


        validator.isValidObject = jest.fn().mockReturnValue(false);
        validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });



        // Act
        let result = await sut.updateUser(updatedUser as User);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should throw BadRequestError when updateUser is given an invalid User', async () => {

        // Arrange
        expect.assertions(1);
        


        validator.isValidObject = jest.fn().mockReturnValue(true);
        validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });

        // Act
        try{
            await sut.updateUser(new User(1, '', '', ''));
        }
        catch(e){
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

        

    });

    test('should throw BadRequestError when updateUser is given an invalid a known User', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        validator.isValidObject = jest.fn().mockReturnValue(false);
        validator.isPropertyOf = jest.fn().mockReturnValue(false);

        mockRepo.update = jest.fn().mockImplementation((user: User) => {
            return new Promise<User>((resolve) => {
                resolve(user);
            });
        });

        // Act
        try{
            await sut.updateUser(new User(1, '', '', ''));
        }
        catch(e){
            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

        

    });

    test('should resolve true when deletedById is given a valid a known id', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number)=> {
            return new Promise<User>((resolve) => {
                resolve(mockUsers[id - 1]);
            });
        });

        validator.isEmptyObject = jest.fn().mockReturnValue(true);

        mockRepo.deleteById = jest.fn().mockImplementation(() => {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        });

        // Act
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should throw BadRequestError when deletedById is given an invalid id', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        validator.isValidId = jest.fn().mockReturnValue(false);

        mockRepo.getById = jest.fn().mockImplementation((id: number)=> {
            return new Promise<User>((resolve) => {
                resolve(mockUsers[id - 1]);
            });
        });

        validator.isEmptyObject = jest.fn().mockReturnValue(true);

        mockRepo.deleteById = jest.fn().mockImplementation(() => {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        });

        // Act
        try{
            await sut.deleteById(0);
        }
        catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
        // Assert
        

    });

    test('should throw ResourceNotFoundError when deletedById is given a valid id ', async () => {

        // Arrange
        expect.assertions(1);
        
        // Act
        try{
        
            validator.isValidId = jest.fn().mockReturnValue(true);

            mockRepo.getById = jest.fn().mockImplementation(()=> {
                return new Promise<User>((resolve) => {
                    resolve({}as User);
                });
            });

            validator.isEmptyObject = jest.fn().mockReturnValue(false);

            // mockRepo.deleteById = jest.fn().mockImplementation((id: number) => {
            //     return new Promise<boolean>((resolve) => {
            //         resolve(true);
            //     });
            // });
            await sut.deleteById(5);
        }
        catch (e) {
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }
        // Assert
        

    });

});