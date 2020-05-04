import { StatRepository } from '../repos/stat-repo';
import { statRepo } from '../config/app';
import * as mockIndex from '..';
import * as mockMapper from '../util/result-set-mapper';
import { Stat } from '../models/stat';
import { User } from '../models/user';


jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    }
});

jest.mock('../util/result-set-mapper', () => {
    return {
        mapUserResultSet: jest.fn()
    }
});

describe('statRepo', () => {

    let sut = statRepo;
    let mockConnect = mockIndex.connectionPool.connect;

    beforeEach(() => {

        (mockConnect as jest.Mock).mockClear().mockImplementation(() => {
            return {
                query: jest.fn().mockImplementation(() => {
                    return {
                        rows: [
                            {
                                statid: 1,
                                arank: 92.77,
                                acl: 99.2,
                                imp: true,
                                created_on: '1999-01-01',
                                cname: 'jvalencia'
                            }
                        ]
                    }
                }), 
                release: jest.fn()
            }
        });

        (mockMapper.mapStatResultSet as jest.Mock).mockClear();
        (mockMapper.mapUserResultSet as jest.Mock).mockClear();
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

});