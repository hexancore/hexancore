import { ImmutableDate } from '../Domain';

export class CurrentTime {
  public static i: CurrentTime;

  private constNow?: ImmutableDate;

  get now(): ImmutableDate {
    return this.constNow ?? ImmutableDate.now();
  }

  set now(now: ImmutableDate | null) {
    this.constNow = now;
  }
}

CurrentTime.i = new CurrentTime();
