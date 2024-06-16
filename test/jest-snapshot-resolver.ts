/**
 * Dependence
 */
import { basename, dirname, join } from "path";

module.exports = {
    resolveSnapshotPath: (testPath: string, snapshotExtension: string) =>
        join(
            dirname(testPath),
            'snapshots',
            basename(testPath) + snapshotExtension,
        ),
    resolveTestPath: (snapshotPath: string, snapshotExtension: string) =>
        join(
            dirname(snapshotPath),
            '..',
            basename(snapshotPath, snapshotExtension),
        ),
    testPathForConsistencyCheck: join('packages', 'core', 'test', 'Example.tests.ts'),
};