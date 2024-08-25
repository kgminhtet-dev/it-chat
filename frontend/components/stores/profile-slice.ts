import { IProfile } from "@/lib/types/IProfile";
import { StateCreator } from "zustand";

export interface ProfileSlice {
  profile: IProfile | undefined;

  setProfile: (profile: IProfile) => void;
}

const createProfileSlice: StateCreator<ProfileSlice> = (set) => ({
  profile: undefined,

  setProfile: (profile: IProfile | undefined) => set({ profile }),
});

export default createProfileSlice;
