import z from "zod";

export const SignUpSchema = z.object({
    username: z.string().min(3).max(32),
    password: z.string().min(5),
    type: z.enum(["user","admin"])
})

export const SignInSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const UpdateMetaDataSchema  = z.object({
    avatarId: z.string()
})
 
export const CreateSpaceSchema = z.object({
    name:z.string(),
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    mapId:z.string()
})
export const AddElementToSpaceSchema = z.object({
    elementId:z.string(),
    spaceId:z.string(),
    x:z.number(),
    y:z.number()
})

export const CreateElementSchema = z.object({
    imageUrl:z.string(),
    height:z.number(),
    width:z.number(),
    static:z.boolean()
})
export const updateElementSchema = z.object({
    imageUrl:z.string()
})

export const createAvatarSchema = z.object({
    imageUrl:z.string(),
    name:z.string().min(3).max(32)
})
export const createMapSchema = z.object({
    thumbnail:z.string(),
    dimension: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
    defaultElements: z.array(z.object({
        elementId:z.string(),
        x:z.number(),
        y:z.number()
    }))
})