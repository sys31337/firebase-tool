/* eslint-disable @typescript-eslint/no-explicit-any */
import { firestore } from 'firebase-admin';

interface FireStorePayload {
  [key: string]: any;
}

interface Filters {
  fieldPath: string | firestore.FieldPath;
  operator: firestore.WhereFilterOp;
  value: any;
}

export type ICreate = (collectionPath: string, payload: FireStorePayload) => Promise<unknown>
export type IUpdate = (collectionPath: string, documentPath: string, payload: FireStorePayload) => Promise<unknown>
export type IDeleteOne = (collectionPath: string, documentPath: string) => Promise<unknown>
export type IDeleteMany = (collectionPath: string, filters?: Filters[]) => Promise<unknown>
export type IFetch = (collectionPath: string) => Promise<firestore.DocumentData[]>
export type IFetchOne = (collectionPath: string, filters?: Filters[]) => Promise<firestore.DocumentData>;
export type IFetchMany = (collectionPath: string, filters?: Filters[]) => Promise<firestore.DocumentData[] | []>;
