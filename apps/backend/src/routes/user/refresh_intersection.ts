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
  "/refresh_intersection",
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

      req.app.locals.intersectionState[secretHash][index] = intersectionState;
      const { tensions: tensions0, contacts: contacts0 } = intersectionState;

      if (req.app.locals.intersectionState[secretHash][1 - index]) {
        const { tensions: tensions1, contacts: contacts1 } =
          req.app.locals.intersectionState[secretHash][1 - index];

        const newTensions: string[] = [];
        const newContacts: string[] = [];

        if (
          tensions0.length !== 0 &&
          tensions1.length !== 0 &&
          tensions0.length === tensions1.length
        ) {
          for (let i = 0; i < tensions0.length; i++) {
            const tension0 = tensions0[i];
            const tension1 = tensions1[i];
            if (tension0 !== tension1) {
              newTensions.push("1");
            } else {
              newTensions.push("0");
            }
          }
        }

        // Create a Set from contacts0 for efficient lookup
        const contactsSet = new Set(contacts0);

        // Find intersection by checking each contact in contacts1
        for (const contact of contacts1) {
          if (contactsSet.has(contact)) {
            newContacts.push(contact);
          }
        }

        return res.status(200).json({
          success: true,
          verifiedIntersectionState: {
            tensions: newTensions,
            contacts: newContacts,
          },
        });
      }

      return res.status(200).json({
        success: false,
        verifiedIntersectionState: {
          tensions: [],
          contacts: [],
        },
      });
    } catch (error) {
      console.error("Error in refresh intersection route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
