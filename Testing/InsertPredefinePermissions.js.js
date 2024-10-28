import mongoose from 'mongoose';
import PermissionModel from "../models/PermissionModel.js";

const predefinedPermissions = [
    {
        entity: 'authentication',
        actions: ['change-password']
    },
    {
        entity: 'opportunity',
        actions: ['create',
            'read',
            'update',
            'delete',
            'get-all'
        ]
    },
    {
        entity: 'tender',
        actions: [
            'create',
            'read',
            'get-all',
            'update',
            'delete'
        ]
    },
    {
        entity: 'business-Development',
        actions: [
            'create',
            'read',
            'get-all',
            'update',
            'delete'
        ]
    },
    {
        entity: 'client',
        actions: [
            'create',
            'read',
            'get-all',
            'update',
            'delete'
        ]
    },
    {
        entity: 'contact',
        actions: [
            'create',
            'read',
            'get-all',
            'update',
            'delete'
        ]
    },
    {
        entity: 'registration',
        actions: [
            'create',
            'read',
            'get-all',
            'update',
            'delete'
        ]
    },
    {
        entity: 'team',
        actions: [
            'create',
            'read',
            'get-all',
            'update',
            'delete'
        ]
    },
    {
        entity: 'configuration',
        actions: [
            'create',
            'get-all',
            'read',
            'update',
            'delete'
        ]
    },
    {
        entity: 'bulk-upload',
        actions: [
            'file-upload',
        ]
    },
    {
        entity: 'role',
        actions: [
            'create',
            'get-all',
            'read',
            'update',
            'delete'
        ]
    },
];

const insertPermissions = async () => {
    try {
        const insert = await PermissionModel.insertMany(predefinedPermissions);
        console.log(insert, 'Predefined permissions inserted successfully');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error inserting predefined permissions:', err);
        mongoose.connection.close();
    }
};

// insertPermissions();


const getAllPermissions = async () => {
    try {
        const result = await PermissionModel.find();
        console.log(result, 'result');
    } catch (error) {
        console.log(error, 'error')
    }
}


// const deleteAllPermissions = async () => {
//     await PermissionModel.deleteMany({});
//     console.log('All permission deleted');
// };

// deleteAllPermission()
//     .then(() => process.exit(0))
//     .catch(err => {
//         console.error(err);
//         process.exit(1);
//     });


// insertPermissions();


// this will require to pass entity-name, sub-entity-id, action-type will fetch
// required permission and will also need to fetch permissions associated with role


// subEntities: [
//     {
//         id: 'sales-champ-role-id', // sub entity id
//         actions: [
//             {
//                 type: 'create',
//                 id: 'id..'
//             },
//             {
//                 type: 'read',
//                 id: 'id..'
//             },
//             {
//                 type: 'get-all',
//                 id: 'id..'
//             },
//             {
//                 type: 'update',
//                 id: 'id..'
//             },
//             {
//                 type: 'delete',
//                 id: 'id..'
//             }
//         ]
//     }
// ]
