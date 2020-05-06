import Validator from '../util/validator';
import { ResourceNotFoundError, BadRequestError, ResourcePersistenceError } from '../errors/errors';
import validator from '../util/validator';
import { StatService } from '../services/stat-service';
import { Stat } from '../models/stat';

jest.mock('../repos/user-repo', () => {
    
    return new class StatRepository {
            getAll = jest.fn();
            getById = jest.fn();
            getStatByUniqueKey = jest.fn();
            save = jest.fn();
    };

});
describe('statService', () => {

    let sut: StatService;
    let mockRepo;

    let mockStats = [
        new Stat(1, 95.2, 99.5, false,'2020-01-01','jvalencia'),
        new Stat(2, 95.2, 99.5, true,'2020-01-01','admin'),
        new Stat(3, 95.2, 99.5, false,'2020-01-01','Alice'),
        new Stat(4, 95.2, 99.5, true,'2020-01-01','jvalencia'),
        new Stat(5, 95.2, 99.5, false,'2020-01-01','jvalencia')
    ];

    beforeEach(() => {

        mockRepo = jest.fn(() => {
            return {
                getAll: jest.fn(),
                getById: jest.fn(),
                getStatByUniqueKey: jest.fn(),
                save: jest.fn()
            };
        });

        // @ts-ignore
        sut = new StatService(mockRepo);
    
    });

    test('should resolve to Stat[] (without passwords) when getAllStats() successfully retrieves stats from the data source', async () => {

        // Arrange
        expect.hasAssertions();
        mockRepo.getAll = jest.fn().mockReturnValue(mockStats);

        // Act
        let result = await sut.getAllStats();

        // Assert
        expect(result).toBeTruthy();
        expect(result.length).toBe(5);

    });

    test('should reject with ResourceNotFoundError when getAllStats fails to get any stats from the data source', async () => {

        // Arrange
        expect.assertions(1);
        mockRepo.getAll = jest.fn().mockReturnValue([]);

        // Act
        try {
            await sut.getAllStats();
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Stat when getStatByUniqueKey is given a valid a known Object', async () => {

        // Arrange
        expect.assertions(2);
        

        validator.isPropertyOf = jest.fn().mockReturnValue(true);
        Validator.isValidStrings = jest.fn().mockReturnValue(true);
        Validator.isEmptyObject = jest.fn().mockReturnValue(false);

        mockRepo.getStatByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
            return new Promise<Stat>((resolve) => {
                resolve(mockStats.find(stat => stat[key] === val));
            });
        });



        // Act
        let result = await sut.getStatByUniqueKey({'account_name': 'admin'});

        // Assert
        expect(result).toBeTruthy();
        expect(result.account_name).toBe('admin');

    });

    test('should reject with BadRequestError when getStatByUniqueKey is given a invalid value as an Object(empty string)', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            validator.isPropertyOf = jest.fn().mockReturnValue(false);
            Validator.isValidStrings = jest.fn().mockReturnValue(false);
            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            await sut.getStatByUniqueKey('');
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with BadRequestError when getStatByUniqueKey is given a invalid value as an Object({"username":""})', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            validator.isPropertyOf = jest.fn().mockReturnValue(true);
            Validator.isValidStrings = jest.fn().mockReturnValue(false);
            Validator.isEmptyObject = jest.fn().mockReturnValue(false);

            mockRepo.getStatByUniqueKey = jest.fn().mockImplementation((key: string, val: string) => {
                return new Promise<Stat>((resolve) => {
                    resolve(mockStats.find(stat => stat[key] === val));
                });
            });
        
            await sut.getStatByUniqueKey({'account_name': ''});
        } catch (e) {

            // Assert
            expect(e instanceof BadRequestError).toBe(true);
        }

    });

    test('should reject with ResourceNotFoundError when getStatByUniqueKey return an empty object', async () => {

        // Arrange
        expect.assertions(1);
        

        // Act
        try {

            validator.isPropertyOf = jest.fn().mockReturnValue(true);
            Validator.isValidStrings = jest.fn().mockReturnValue(true);
            Validator.isEmptyObject = jest.fn().mockReturnValue(true);
            mockRepo.getStatByUniqueKey = jest.fn().mockImplementation(() => {
                return new Promise<Stat>((resolve) => {
                    resolve({} as Stat);
                });
            });
            await sut.getStatByUniqueKey({'account_name': 'x'});
        } catch (e) {

            // Assert
            expect(e instanceof ResourceNotFoundError).toBe(true);
        }

    });

    test('should resolve to Stat when addStats is given a valid a known User', async () => {

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

        sut.getStatByUniqueKey = jest.fn().mockImplementation(() => {
            return new Promise<Stat>((resolve) => {
                resolve(mockStats.find(stat => stat['account_name'] === 'admin'));
            });
        });

        mockRepo.save = jest.fn().mockImplementation((stat: Stat) => {
            return new Promise<Stat>((resolve) => {
                resolve(stat);
            });
        });

        // Act
        let result = await sut.addStats(entries,'admin');

        // Assert
        expect(result).toBeTruthy();
        expect(result.account_name).toBe('admin');

    });

    test('should ResourcePersistenceError when addStats is given an unavailable username', async () => {

        // Arrange
        expect.assertions(1);
        

        validator.isValidObject = jest.fn().mockReturnValue(true);

        mockRepo.save = jest.fn().mockImplementation((stat: Stat) => {
            return new Promise<Stat>((resolve) => {
                resolve(stat);
            });
        });
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


        // Act
        try{
            
            sut.getStatByUniqueKey = jest.fn().mockImplementation(() => {
                throw new ResourcePersistenceError;
            });

            await sut.addStats(entries,'Alicex');
        }
        catch(e){
            expect(e instanceof ResourcePersistenceError).toBe(true);
        }

        // Assert
        

    });

    

});