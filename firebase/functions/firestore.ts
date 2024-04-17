import { firestore } from 'firebase-admin';
import { db } from '../firebase';
import {
  ICreate, IDeleteMany, IDeleteOne, IFetch, IFetchMany, IFetchOne, IUpdate,
} from '../types';
import { chunk } from '../utils';

export const fetch: IFetch = async (collectionPath) => {
  const docRef = db.collection(collectionPath);
  const result: firestore.DocumentData[] = [];
  const data = await docRef.get();
  data.forEach((doc) => result.push(doc.data()));
  return result;
};

export const fetchMany: IFetchMany = async (collectionPath, filters) => {
  try {
    let query: firestore.CollectionReference<firestore.DocumentData> | firestore.Query<firestore.DocumentData> = db.collection(collectionPath); // Explicitly type query

    if (filters && filters.length > 0) {
      filters.forEach((filter, index) => {
        if (index === 0) {
          query = query.where(filter.fieldPath, filter.operator, filter.value);
        } else {
          query = (query as firestore.Query<firestore.DocumentData>).where(filter.fieldPath, filter.operator, filter.value);
        }
      });
    }
    const result: firestore.DocumentData[] = [];
    const docSnapshot = await query.get();
    docSnapshot.docs.forEach((doc) => result.push(doc.data()));
    return result;
  } catch (error) {
    return [];
  }
};

export const fetchOne: IFetchOne = async (collectionPath, filters) => {
  try {
    let query: firestore.CollectionReference<firestore.DocumentData> | firestore.Query<firestore.DocumentData> = db.collection(collectionPath); // Explicitly type query

    if (filters && filters.length > 0) {
      filters.forEach((filter, index) => {
        if (index === 0) {
          query = query.where(filter.fieldPath, filter.operator, filter.value);
        } else {
          query = (query as firestore.Query<firestore.DocumentData>).where(filter.fieldPath, filter.operator, filter.value);
        }
      });
    }

    const docSnapshot = await query.get();
    const document = docSnapshot.docs[0].data();
    return document;
  } catch (error) {
    return null;
  }
};

export const create: ICreate = async (collectionPath, payload) => {
  try {
    const collectionRef = db.collection(collectionPath);
    const docRef = collectionRef.doc();
    await docRef.set(payload);
    return docRef;
  } catch (error) {
    return error;
  }
};

export const update: IUpdate = async (collectionPath, documentPath, payload) => {
  try {
    const docRef = db.collection(collectionPath).doc(documentPath).update(payload);
    return docRef;
  } catch (error) {
    return error;
  }
};

export const deleteOne: IDeleteOne = async (collectionPath, documentPath) => {
  try {
    const docRef = db.collection(collectionPath).doc(documentPath).delete();
    return docRef;
  } catch (error) {
    return error;
  }
};

export const deleteMany: IDeleteMany = async (collectionPath, filters) => {
  try {
    let query: firestore.CollectionReference<firestore.DocumentData> | firestore.Query<firestore.DocumentData> = db.collection(collectionPath); // Explicitly type query
    const MAX_WRITES_PER_BATCH = 200;

    if (filters && filters.length > 0) {
      filters.forEach((filter, index) => {
        if (index === 0) {
          query = query.where(filter.fieldPath, filter.operator, filter.value);
        } else {
          query = (query as firestore.Query<firestore.DocumentData>).where(filter.fieldPath, filter.operator, filter.value);
        }
      });
    }
    const result: firestore.DocumentData[] = [];
    const docSnapshot = await query.get();

    const batches = chunk(docSnapshot.docs, MAX_WRITES_PER_BATCH);
    const commitBatchPromises: unknown[] = [];

    batches.forEach((batch) => {
      const writeBatch = db.batch();
      batch.forEach((doc) => writeBatch.delete(doc.ref));
      commitBatchPromises.push(writeBatch.commit());
    });
    await Promise.all(commitBatchPromises);

    return result;
  } catch (error) {
    return error;
  }
};
