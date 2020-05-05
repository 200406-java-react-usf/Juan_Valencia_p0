import { CharRepository } from "../repos/char-repo";
//import * as mockIndex from '..';
import { connectionPool } from '..'
import * as mockMapper from '../util/result-set-mapper';
import { Character } from "../models/character";

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapCharacterResultSet: jest.fn()
    }
});

describe('charRepo', () => {

    let sut = new CharRepository();
    let mockConnect = connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                id: 1,
                                char_name: 'Steelyx',
                                league_name: 'SSF Blight HC',
                                ranking: 1,
                                character_level:100,
                                account_name:'admin'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });
        
        (mockMapper.mapCharacterResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Characters when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockUser = new Character(1,'cn','ln',1,100,'acn');
        (mockMapper.mapCharacterResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(1);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to an empty array when getAll retrieves a records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getAll();

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);
        expect(result.length).toBe(0);
        expect(mockConnect).toBeCalledTimes(1);

    });

    test('should resolve to a Character Array object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Character(1,'cn','ln',1,100,'acn');
        (mockMapper.mapCharacterResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);

    });

    test('should resolve to an empty array when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Array).toBe(true);

    });

    test('should resolve to a Character object when getCharByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Character(1,'cn','ln',1,100,'acn');
        (mockMapper.mapCharacterResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getCharByUniqueKey('char_name', 'Steelyx');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Character).toBe(true);

    });

    test('should resolve to an empty array when getCharByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getCharByUniqueKey('char_name', 'Steelyx');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Character).toBe(true);

    });


    test('should resolve to a Character object when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Character(1,'cn','ln',1,100,'acn');
        (mockMapper.mapCharacterResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.save(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Character).toBe(true);

    });

    test('should resolve to an empty array when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new Character(1,'cn','ln',1,100,'acn');
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.save(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Character).toBe(true);

    });

    test('should resolve to true when update updates a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new Character(1,'cn','ln',1,100,'acn');
        (mockMapper.mapCharacterResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.update(mockUser);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });

    test('should resolve to true when deleteById deletes a record on the data source', async () => {

        // Arrange
        expect.hasAssertions();

        
        (mockMapper.mapCharacterResultSet as jest.Mock).mockReturnValue(true);

        // Act
        let result = await sut.deleteById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result).toBe(true);

    });


});