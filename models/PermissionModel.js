// import mongoose from "mongoose";

// const ActionSchema = new mongoose.Schema({
//     type: { type: String, required: true, trim: true }
// });

// const SubEntitySchema = new mongoose.Schema({
//     subEntityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roles', required: true },
//     actions: [ActionSchema]
// });

// const PermissionSchema = new mongoose.Schema(
//     {
//         entity: { type: String, required: true, trim: true },
//         actions: [ActionSchema],
//         subEntities: [SubEntitySchema],
//         description: { type: String }
//     },
//     { timestamps: true }
// );

// const PermissionModel = mongoose.model("Permission", PermissionSchema);

// export default PermissionModel;

import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema({
    type: { type: String, required: true, trim: true }
});

const PermissionSchema = new mongoose.Schema(
    {
        entity: { type: String, required: true, trim: true, unique: true },
        actions: [{ type: String, required: true, trim: true }],
        description: { type: String }
    },
    { timestamps: true }
);

const PermissionModel = mongoose.model("Permission", PermissionSchema);

export default PermissionModel;
