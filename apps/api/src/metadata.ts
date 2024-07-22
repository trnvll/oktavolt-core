/* eslint-disable */
export default async () => {
    const t = {
        ["../../../packages/database/dist/types/models/relationship/enums"]: await import("../../../packages/database/dist/types/models/relationship/enums"),
        ["./modules/relationships/dtos/create-relationships.dto"]: await import("./modules/relationships/dtos/create-relationships.dto"),
        ["./modules/users/dtos/create-user.dto"]: await import("./modules/users/dtos/create-user.dto"),
        ["./modules/comms/dtos/create-comms.dto"]: await import("./modules/comms/dtos/create-comms.dto"),
        ["../../../packages/database/dist/types/models/communication/enums"]: await import("../../../packages/database/dist/types/models/communication/enums"),
        ["./modules/prefs/dtos/create-prefs.dto"]: await import("./modules/prefs/dtos/create-prefs.dto"),
        ["./modules/relationships/dtos/find-one-relationship.dto"]: await import("./modules/relationships/dtos/find-one-relationship.dto"),
        ["./modules/users/dtos/find-one-user.dto"]: await import("./modules/users/dtos/find-one-user.dto"),
        ["./modules/comms/dtos/find-one-comm.dto"]: await import("./modules/comms/dtos/find-one-comm.dto"),
        ["./modules/prefs/dtos/find-one-pref.dto"]: await import("./modules/prefs/dtos/find-one-pref.dto")
    };
    return { "@nestjs/swagger": { "models": [[import("./modules/relationships/dtos/find-one-relationship.dto"), { "FindOneRelationshipDto": { relationshipId: { required: true, type: () => Number }, name: { required: true, type: () => String }, relationType: { required: true, enum: t["../../../packages/database/dist/types/models/relationship/enums"].RelationshipTypeEnum }, email: { required: true, type: () => String, nullable: true }, phone: { required: true, type: () => String, nullable: true }, address: { required: true, type: () => String, nullable: true }, notes: { required: true, type: () => String, nullable: true } } }], [import("./modules/relationships/dtos/find-all-relationships.dto"), { "FindAllRelationshipsDto": {} }], [import("./modules/relationships/dtos/create-relationships.dto"), { "CreateRelationshipsDto": { data: { required: true, type: () => [t["./modules/relationships/dtos/create-relationships.dto"].CreateRelationshipDto] } }, "CreateRelationshipDto": { name: { required: true, type: () => String }, relationType: { required: true, enum: t["../../../packages/database/dist/types/models/relationship/enums"].RelationshipTypeEnum }, email: { required: false, type: () => String }, phone: { required: false, type: () => String }, address: { required: false, type: () => String }, context: { required: false, type: () => String } } }], [import("./core/events/dtos/create-event-user-data-updated.dto"), { "CreateEventUserDataUpdatedDto": { userId: { required: true, type: () => Number }, data: { required: true, type: () => Object } }, "CreateEventUserDataUpdatedJob": { user: { required: true }, data: { required: true, type: () => Object } } }], [import("./modules/users/dtos/find-one-user.dto"), { "FindOneUserDto": { userId: { required: true, type: () => Number }, firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date } } }], [import("./modules/users/dtos/create-user.dto"), { "CreateUsersDto": { data: { required: true, type: () => [t["./modules/users/dtos/create-user.dto"].CreateUserDto] } }, "CreateUserDto": { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, dateOfBirth: { required: true, type: () => Date }, context: { required: false, type: () => String } } }], [import("./core/events/dtos/create-event-user-created.dto"), { "CreateEventUserCreatedDto": { userId: { required: true, type: () => Number }, data: { required: true, type: () => Object } }, "CreateEventUserCreatedJob": { user: { required: true }, data: { required: true, type: () => Object } } }], [import("./core/events/dtos/create-event-user-deleted.dto"), { "CreateEventUserDeletedDto": { userId: { required: true, type: () => Number }, data: { required: true, type: () => Object } } }], [import("./modules/comms/dtos/create-comms.dto"), { "CreateCommsDto": { data: { required: true, type: () => [t["./modules/comms/dtos/create-comms.dto"].CreateCommDto] } }, "CreateCommDto": { type: { required: true, enum: t["../../../packages/database/dist/types/models/communication/enums"].CommunicationTypeEnum }, content: { required: true, type: () => String }, timestamp: { required: false, type: () => Date }, sender: { required: false, type: () => String }, receiver: { required: true, type: () => String }, provider: { required: true, enum: t["../../../packages/database/dist/types/models/communication/enums"].CommunicationProviderEnum } } }], [import("./modules/comms/dtos/find-one-comm.dto"), { "FindOneCommDto": { commId: { required: true, type: () => Number }, type: { required: true, enum: t["../../../packages/database/dist/types/models/communication/enums"].CommunicationTypeEnum }, content: { required: true, type: () => String }, timestamp: { required: true, type: () => Date, nullable: true }, sender: { required: true, type: () => String, nullable: true }, receiver: { required: true, type: () => String }, provider: { required: true, enum: t["../../../packages/database/dist/types/models/communication/enums"].CommunicationProviderEnum } } }], [import("./modules/comms/dtos/find-all-comms.dto"), { "FindAllCommsDto": {} }], [import("./modules/prefs/dtos/find-one-pref.dto"), { "FindOnePrefDto": { prefId: { required: true, type: () => Number }, userId: { required: true, type: () => Number }, preferenceType: { required: true, type: () => String }, value: { required: true, type: () => String, nullable: true } } }], [import("./modules/prefs/dtos/find-all-prefs.dto"), { "FindAllPrefsDto": {} }], [import("./modules/prefs/dtos/create-prefs.dto"), { "CreatePrefsDto": { data: { required: true, type: () => [t["./modules/prefs/dtos/create-prefs.dto"].CreatePrefDto] } }, "CreatePrefDto": { preferenceType: { required: true, type: () => String }, value: { required: false, type: () => String }, context: { required: false, type: () => String } } }], [import("./modules/embeddings/dtos/generate-embeddings.dto"), { "GenerateEmbeddingsDto": { content: { required: true, type: () => String } } }], [import("./modules/embeddings/dtos/query-embeddings.dto"), { "QueryEmbeddingsDto": { query: { required: true, type: () => String } } }], [import("./modules/users/dtos/find-all-users.dto"), { "FindAllUsersDto": {} }]], "controllers": [[import("./modules/relationships/controllers/relationships.controller"), { "RelationshipsController": { "findAll": { type: [t["./modules/relationships/dtos/find-one-relationship.dto"].FindOneRelationshipDto] }, "findOne": { type: t["./modules/relationships/dtos/find-one-relationship.dto"].FindOneRelationshipDto }, "create": {}, "delete": {} } }], [import("./modules/users/controllers/users.controller"), { "UsersController": { "findAll": {}, "findOne": { type: t["./modules/users/dtos/find-one-user.dto"].FindOneUserDto }, "create": {}, "delete": {} } }], [import("./modules/comms/controllers/comms.controller"), { "CommsController": { "findAll": { type: [t["./modules/comms/dtos/find-one-comm.dto"].FindOneCommDto] }, "findOne": { type: t["./modules/comms/dtos/find-one-comm.dto"].FindOneCommDto }, "create": {}, "delete": {} } }], [import("./modules/prefs/controllers/prefs.controller"), { "PrefsController": { "findAll": { type: [t["./modules/prefs/dtos/find-one-pref.dto"].FindOnePrefDto] }, "findOne": { type: t["./modules/prefs/dtos/find-one-pref.dto"].FindOnePrefDto }, "create": {}, "delete": {} } }], [import("./modules/embeddings/controllers/embeddings.controller"), { "EmbeddingsController": { "query": { type: String }, "generateEmbeddings": { type: [[Number]] } } }]] } };
};