/** Спільний queryKey для списку відгуків (головна / сторінка локації). */
export function feedbacksQueryKey(locationId?: string) {
  return ['feedbacks', locationId ?? 'latest'] as const;
}
