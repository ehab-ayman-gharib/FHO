import {
    bootstrapCameraKit,
    Injectable,
    remoteApiServicesFactory,
} from "@snap/camera-kit";
import type {
    RemoteApiService,
    RemoteApiRequest,
    RemoteApiRequestHandler,
} from "@snap/camera-kit";
import { CAMERAKIT_CONFIG } from "./config/camerakit";


const lensRemoteAPIHandler: RemoteApiService = {
    apiSpecId: '61a6e3e3-9542-40f9-a849-2b8157d91548',
    getRequestHandler(request: RemoteApiRequest): RemoteApiRequestHandler | undefined {
        if (request.endpointId !== "enable_share") return;
        console.log("REMOTE API :" + request.parameters.yourParameter);

        return (reply) => {
            console.log("SHAAAARE");
            reply({
                status: "success",
                metadata: {},
                body: new TextEncoder().encode(request.endpointId + " responded") as unknown as ArrayBuffer,
            });
        };
    },
};

export const bootstrapCameraKitWithRemoteAPI = async () => {
    return await bootstrapCameraKit(
        {
            apiToken: CAMERAKIT_CONFIG.API_TOKEN,
            logger: "console",
        },
        (container) => {
            return container.provides(
                Injectable(
                    remoteApiServicesFactory.token,
                    [remoteApiServicesFactory.token],
                    (existing: any) => [...existing, lensRemoteAPIHandler]
                )
            );
        }
    );
};

