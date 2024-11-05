import express, { Request, Response } from "express";
import {
  ErrorResponse,
  errorToString,
  RefreshIntersectionRequest,
  RefreshIntersectionRequestSchema,
  RefreshIntersectionResponse,
} from "@types";

const router = express.Router();

router.post(
  "/refresh_intersection_go_deeper",
  async (
    req: Request<{}, {}, RefreshIntersectionRequest>,
    res: Response<RefreshIntersectionResponse | ErrorResponse>
  ) => {
    try {
      const validatedData = RefreshIntersectionRequestSchema.parse(req.body);
      const { secretHash, index, intersectionState } = validatedData;

      if (!req.app.locals.intersectionState[secretHash]) {
        req.app.locals.intersectionState[secretHash] = {};
      }

      // access memory of the tensions/contacts if they exist, and do not overwrite
      if (req.app.locals.intersectionState[secretHash][index]) {
        const {tensions: current_tensions, contacts: current_contacts} = req.app.locals.intersectionState[secretHash][index]
        intersectionState.tensions = current_tensions
        intersectionState.contacts = current_contacts  
      }

      req.app.locals.intersectionState[secretHash][index] = intersectionState;
      const { journeys: journeys0 } = intersectionState;

      if (req.app.locals.intersectionState[secretHash][1 - index]) {
        const { journeys: journeys1 } =
          req.app.locals.intersectionState[secretHash][1 - index];

        const newjourneys: string[] = [];

        // if one users journeys is empty, they did not yet click go deeper
        if (journeys0.length > 0 && journeys1.length > 0) {
          const journeysSet = new Set(journeys0);

          for (const journey of journeys1) {
            if (journeysSet.has(journey)) {
              newjourneys.push(journey);
            }
          }
        }

        return res.status(200).json({
          success: true,
          verifiedIntersectionState: {
            tensions: [],
            contacts: [],
            journeys: newjourneys
          },
        });
      }

      return res.status(200).json({
        success: false,
        verifiedIntersectionState: {
          tensions: [],
          contacts: [],
          journeys: [],
        },
      });
    } catch (error) {
      console.error("Error in refresh intersection route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
