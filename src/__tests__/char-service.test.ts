import { CharService } from '../services/char-service';
import { Character } from '../models/character';
import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, AuthenticationError } from '../errors/errors';
import validator from '../util/validator';

jest.mock('../repos/char-repo', () => {
    
    return new class CharRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getCharByUniqueKey = jest.fn();
            save = jest.fn();
            update = jest.fn();
            deleteById = jest.fn();
    }

});
describe('charService', () => {

    let sut: CharService;
    let mockRepo;

    let mockChars = [
        new Character(1, 'aanderson', 'SSF Blight HC', 1, 100, 'jvalencia'),
        new Character(2, 'bbailey', 'SSF Blight HC',  1, 100, 'jval'),
        new Character(3, 'ccountryman', 'SSF Blight HC', 1, 100, 'jd'),
        new Character(4, 'ddavis', 'SSF Blight HC', 1, 100, 'jx'),
        new Character(5, 'eeinstein', 'SSF Blight HC', 1, 100, 'jt')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getCharByUniqueKey: jest.fn(),
                save: jest.fn(),
                update: jest.fn(),
                deleteById: jest.fn()
            }
        });

        // @ts-ignore
        sut = new CharService(mockRepo);
    
    });

    test('should resolve to Character[] (without passwords) when getAllChars() successfully retrieves characters from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockChars);

        // Act
        let result = await sut.getAllChars();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);

    });

    test('should reject with ResourceNotFoundError when getAllChars fails to get any characters from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllChars();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Character[] when getCharById is given a valid an known id', async () => {

        // Arrange
        expect.assertions(2);
        Validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.getById = jest.fn().mockImplementation((id: number) => {
            return new Promise<Character[]>((resolve) => {
                mockChars.map(chars => { chars['charId'] === id})
                resolve(mockChars)
            });
        });


        // Act
        let result = await sut.getCharById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);

    });

    test('should reject with BadRequestError when getCharById is given a invalid value as an id (decimal)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getCharById(3.14);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getCharById is given a invalid value as an id (zero)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getCharById(0);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getCharById is given a invalid value as an id (NaN)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getCharById(NaN);
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getCharById is given a invalid value as an id (negative)', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getById = jest.fn().mockReturnValue(false);

        // Act
        try {
            await sut.getCharById(-2);
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
            await sut.getCharById(9999);
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Character when getCharByUniqueKey is given a valid a known Object(account name)', async () => {

        // Arrange
        expect.assertions(2);
        
        
        validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);

        mockRepo.getCharByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
            return new Promise<Character>((resolve) => {
                resolve(mockChars.find(user => user[key] === val));
            });
        });



        // Act
        let result = await sut.getCharByUniqueKey({'accountName': 'jvalencia'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.accountName).toBe('jvalencia');

    });

    test('should reject with BadRequestError when getCharByUniqueKey is given a invalid value as an Object(empty string)', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

        validator.isPropertyOf = jest.fn().mockReturnValue(false);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            await sut.getCharByUniqueKey('');
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getCharByUniqueKey is given a invalid value as an Object({"username":""})', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

        validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(false);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);

        mockRepo.getUserByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
            return new Promise<Character>((resolve) => {
                resolve(mockChars.find(user => user[key] === val));
            });
        });
        
            await sut.getCharByUniqueKey({'username': ''});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError when getCharByUniqueKey return an empty object', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

        validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(true);
        mockRepo.getCharByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
            return new Promise<Character>((resolve) => {
                resolve({} as Character);
            });
        });
            await sut.getCharByUniqueKey({'charName': 'x'});
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Character when addNewChar is given a valid a known Character', async () => {

        // Arrange
        expect.assertions(2);
        
        let entries = [
            {
                'rank': 7,
                'character': { 'name': 'James', 'level': 100 }
            },
            {
                'rank': 1,
                'character': { 'name': 'John', 'level': 100 } 
            }
        ];

        validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((user: Character) => {
            return new Promise<Character>((resolve) => {
                resolve(user);
            });
        });

        // Act
        let result = await sut.addNewChar(entries,'jvalencia','SSF Blight HC');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Character).toBe(true);

    });

    test('should resolve true when updateChar is given a valid a known Character', async () => {

        // Arrange
        expect.assertions(1);
        

        //Object.keys = jest.fn().mockImplementation(() => { return ['id']});
        validator.isValidObject = jest.fn().mockReturnValue(false);
        validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockImplementation((user: Character) => {
            return new Promise<Character>((resolve) => {
                resolve(user);
            });
        });



        // Act
        let result = await sut.updateChar(new Character(1, 'aanderson', 'SSF Blight HC', 1, 100, 'jvalencia'));

        // Assert
        expect(result).toBeTruthy();

    });

    test('should throw BadRequestError when updateChar is given an invalid Character', async () => {

        // Arrange
        expect.assertions(1);
        
        validator.isValidObject = jest.fn().mockReturnValue(false);
        validator.isPropertyOf = jest.fn().mockReturnValue(true);

        mockRepo.update = jest.fn().mockImplementation((user: Character) => {
            return new Promise<Character>((resolve) => {
                resolve(user);
            });
        });

        // Act
        try{
            await sut.updateChar(new Character(1, '', '',1,0,''));
        }
        catch(e){
           // Assert
           expect(e instanceof BadRequestError).toBe(true);
        }

        

    });

    test('should throw BadRequestError when updateChar is given an invalid a known Character', async () => {

        // Arrange
        expect.assertions(1);
        

        validator.isValidObject = jest.fn().mockReturnValue(true);
        validator.isPropertyOf = jest.fn().mockReturnValue(false);

        mockRepo.update = jest.fn().mockImplementation((user: Character) => {
            return new Promise<Character>((resolve) => {
                resolve(user);
            });
        });

        // Act
        try{
            await sut.updateChar(new Character(1, '', '',1,0,''));
        }
        catch(e){
           // Assert
           expect(e instanceof BadRequestError).toBe(true);
        }

        

    });

    test('should resolve true when deletedById is given a valid a known id', async () => {

        // Arrange
        expect.assertions(1);
        
        validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.deleteById = jest.fn().mockImplementation((id: number) => {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        });

        // Act
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();

    });

    test('should return true when deletedById is given a valid id ', async () => {

        // Arrange
        expect.assertions(1);
        
        // Act
        
        validator.isValidId = jest.fn().mockReturnValue(true);

        mockRepo.deleteById = jest.fn().mockImplementation((id: number)=> {
            return new Promise<boolean>((resolve) => {
                resolve(true);
            });
        })

        let result = await sut.deleteById(5);
        
        // Assert
        expect(result).toBe(true);

    });

    test('should throw BadRequestError when deletedById is given an invalid id(negative) ', async () => {

        // Arrange
        expect.assertions(1);
        
        // Act
        try{
        
        validator.isValidId = jest.fn().mockReturnValue(false);

        
            await sut.deleteById(-1);
        }
        catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
        // Assert
        

    });

    test('should throw BadRequestError when deletedById is given an invalid id(decimal) ', async () => {

        // Arrange
        expect.assertions(1);
        
        // Act
        try{
        
        validator.isValidId = jest.fn().mockReturnValue(false);

        
            await sut.deleteById(4.20);
        }
        catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
        // Assert
        

    });

    test('should throw BadRequestError when deletedById is given an invalid id(zero) ', async () => {

        // Arrange
        expect.assertions(1);
        
        // Act
        try{
        
        validator.isValidId = jest.fn().mockReturnValue(false);

        
            await sut.deleteById(0);
        }
        catch (e) {
            expect(e instanceof BadRequestError).toBe(true);
        }
        // Assert
        

    });

});