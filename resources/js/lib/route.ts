/**
 * Route helper for Inertia React
 * Generates URLs for named routes
 */
export function route(
    name: string,
    params?: Record<string, any> | string | number,
): string {
    return generatePath(name, params);
}

function generatePath(
    name: string,
    params?: Record<string, any> | string | number,
): string {
    const routes: Record<string, string> = {
        'vendor.tables.index': '/vendor/tables',
        'vendor.tables.create': '/vendor/tables/create',
        'vendor.tables.show': '/vendor/tables/:id',
        'vendor.tables.edit': '/vendor/tables/:id/edit',
        'vendor.tables.store': '/vendor/tables',
        'vendor.tables.update': '/vendor/tables/:id',
        'vendor.tables.destroy': '/vendor/tables/:id',
        'vendor.rows.store': '/vendor/tables/:id/rows',
        'vendor.rows.update': '/vendor/tables/:tableId/rows/:id',
        'vendor.rows.destroy': '/vendor/tables/:tableId/rows/:id',
    };

    let path = routes[name];

    if (!path) {
        console.error(`Route "${name}" not found`);
        return '/';
    }

    // Convert single ID to params object
    let paramObj: Record<string, any> = {};
    if (params !== undefined) {
        if (typeof params === 'object' && params !== null) {
            paramObj = params;
        } else {
            // Single ID parameter
            paramObj = { id: params };
        }
    }

    if (Object.keys(paramObj).length > 0) {
        // Replace route parameters
        Object.entries(paramObj).forEach(([key, value]) => {
            path = path.replace(`:${key}`, String(value));
            // Also try with just the key for singular resources
            path = path.replace(`:${key}Id`, String(value));
        });
    }

    return path;
}
