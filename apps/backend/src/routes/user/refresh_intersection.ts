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
      const {
        tensions: tensions0,
        contacts: contacts0,
        devconEvents: devconEvents0,
        programmingLangs: programmingLangs0,
        starredRepos: starredRepos0,
      } = intersectionState;

      if (req.app.locals.intersectionState[secretHash][1 - index]) {
        const {
          tensions: tensions1,
          contacts: contacts1,
          devconEvents: devconEvents1,
          programmingLangs: programmingLangs1,
          starredRepos: starredRepos1,
        } =
          req.app.locals.intersectionState[secretHash][1 - index];

        const newTensions: string[] = [];
        const newContacts: string[] = [];
        const newDevconEvents: string[] = [];
        const newProgrammingLangs: string[] = [];
        const newStarredRepos: string[] = [];

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

        // Create a Set from contacts0 for efficient lookup
        const devconEventsSet = new Set(devconEvents0);

        // Find intersection by checking each contact in contacts1
        for (const event of devconEvents1) {
          if (devconEventsSet.has(event)) {
            newDevconEvents.push(event);
          }
        }

        // Create a Set from contacts0 for efficient lookup
        const langsSet = new Set(programmingLangs0);

        // Find intersection by checking each contact in contacts1
        for (const lang of programmingLangs1) {
          if (langsSet.has(lang)) {
            newProgrammingLangs.push(lang);
          }
        }

        // Create a Set from contacts0 for efficient lookup
        const starredReposSet = new Set(starredRepos0);

        // Find intersection by checking each contact in contacts1
        for (const repo of starredRepos1) {
          if (starredReposSet.has(repo)) {
            newStarredRepos.push(repo);
          }
        }

        return res.status(200).json({
          success: true,
          verifiedIntersectionState: {
            tensions: newTensions,
            contacts: newContacts,
            devconEvents: newDevconEvents,
            programmingLangs: newProgrammingLangs,
            starredRepos: newStarredRepos,
          },
        });
      }

      return res.status(200).json({
        success: false,
        verifiedIntersectionState: {
          tensions: [],
          contacts: [],
          devconEvents: [],
          programmingLangs: [],
          starredRepos: [],
        },
      });
    } catch (error) {
      console.error("Error in refresh intersection route:", error);
      return res.status(400).json({ error: errorToString(error) });
    }
  }
);

export default router;
