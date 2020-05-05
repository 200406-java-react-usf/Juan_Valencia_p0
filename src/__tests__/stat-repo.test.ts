import { StatRepository } from '../repos/stat-repo';
//import * as mockIndex from '..';
import { connectionPool } from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Stat } from '../models/stat';
import { User } from '../models/user';

jest.mock('..', () => {
    return {
        connectionPool: {
            connect: jest.fn()
        }
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapStatResultSet: jest.fn(),
        mapUserResultSet: jest.fn()
    }
});




describe('statRepo', () => {

    let sut = new StatRepository();
    let mockConnect = connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                stat_id: 1,
                                avg_rank: 92.77,
                                avg_char_level: 99.2,
                                improved: true,
                                created_on: '1999-01-01',
                                account_name: 'jvalencia'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });

        (mockMapper.mapStatResultSet as jest.Mock).mockClear();
    });

    test('should resolve to an array of Stats when getAll retrieves records from data source', async () => {
        
        // Arrange
        expect.hasAssertions();

        let mockStat = new Stat(1, 95.2, 99.3, true, '1990-01-01', 'jvalencia');
        (mockMapper.mapStatResultSet as jest.Mock).mockReturnValue(mockStat);

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

    test('should resolve to a User object when getStatByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1,'jv','pw','admin');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockUser);

        // Act
        let result = await sut.getStatByUniqueKey('username', 'jvalencia');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);

    });

    test('should resolve to an empty array when getStatByUniqueKey retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();
        
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] }  }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.getStatByUniqueKey('username', 'jvalencia');

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof User).toBe(true);

    });

    test('should resolve to a Stat object when getById retrieves a record from data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockStat = new Stat(1, 95.2, 99.3, true, '1990-01-01', 'jvalencia');
        (mockMapper.mapStatResultSet as jest.Mock).mockReturnValue(mockStat);

        // Act
        let result = await sut.getById(1);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Stat).toBe(true);

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
        expect(result instanceof Stat).toBe(true);

    });

    test('should resolve to a User object when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();

        let mockUser = new User(1, 'un', 'pw', 'an');
        let mockStat = new Stat(1, 95.2, 99.3, true, '1990-01-01', 'jvalencia');
        (mockMapper.mapUserResultSet as jest.Mock).mockReturnValue(mockStat);

        // Act
        let result = await sut.save(mockUser,12,100);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Stat).toBe(true);

    });

    test('should resolve to an empty array when save persists a record to the data source', async () => {

        // Arrange
        expect.hasAssertions();
        let mockUser = new User(1, 'un', 'pw', 'an');
        (mockConnect as jest.Mock).mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => { return { rows: [] } }), 
                release: jest.fn()
            }
        });

        // Act
        let result = await sut.save(mockUser,1,100);

        // Assert
        expect(result).toBeTruthy();
        expect(result instanceof Stat).toBe(true);

    });

});