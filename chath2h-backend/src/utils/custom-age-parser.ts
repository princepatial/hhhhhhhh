enum AGE_FILTERS {
  NEEDS_OFFERS_FROM = 'user.age.from',
  NEEDS_OFFERS_TO = 'user.age.to',
  COACH_FROM = 'age.from',
  COACH_TO = 'age.to',
}

export class FilterParser {
  parse(value: any) {
    const parsedVal = JSON.parse(value);
    const parsedKeys = Object.keys(parsedVal);

    const needsOffersAgeKey = parsedKeys.includes(
      AGE_FILTERS.NEEDS_OFFERS_FROM,
    );
    const coachAgeFilter = parsedKeys.includes(AGE_FILTERS.COACH_FROM);

    if (!needsOffersAgeKey && !coachAgeFilter) return JSON.parse(value);

    let ageFilter: { $gte?: number; $lte?: number } = {};

    if (needsOffersAgeKey) {
      ageFilter = this.parseAgeFilter(parsedVal, [
        AGE_FILTERS.NEEDS_OFFERS_FROM,
        AGE_FILTERS.NEEDS_OFFERS_TO,
      ]);

      delete parsedVal[AGE_FILTERS.NEEDS_OFFERS_FROM];
      delete parsedVal[AGE_FILTERS.NEEDS_OFFERS_TO];

      parsedVal['user.age'] = ageFilter;
    }

    if (coachAgeFilter) {
      ageFilter = this.parseAgeFilter(parsedVal, [
        AGE_FILTERS.COACH_FROM,
        AGE_FILTERS.COACH_TO,
      ]);

      delete parsedVal[AGE_FILTERS.COACH_FROM];
      delete parsedVal[AGE_FILTERS.COACH_TO];

      parsedVal['age'] = ageFilter;
    }

    return parsedVal;
  }

  private parseAgeFilter(parsedVal: any, key: string[]) {
    const ageFilter: { $gte?: number; $lte?: number } = {};

    if (parsedVal?.[key[0]]) {
      ageFilter.$gte = Number(parsedVal[key[0]]);
    }

    if (parsedVal?.[key[1]]) {
      ageFilter.$lte = Number(parsedVal[key[1]]);
    }

    return ageFilter;
  }
}
