import { AsyncPipe, JsonPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Signal,
  SimpleChanges,
  WritableSignal,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, map, of, tap } from 'rxjs';

interface IUser {
  name: string;
  age: number;
}

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserCardComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {
    console.log('OnChanges', changes);
  }
  useri = input.required<IUser>();
  @Input({ required: true }) userS!: Signal<IUser>;
  @Input() agei: number | null = 7;
  @Output() ageChange = new EventEmitter<number>();

  userChange = output<IUser>();

  ei = effect(() => {
    const u = this.useri();
    this.userChange.emit(u);
    console.log('InputSignal', u);
  });
  eS = effect(() => {
    const u = this.userS();
    console.log('Signal@Input', u);
  });
  @Input() userInput!: IUser;
  user$: BehaviorSubject<IUser> = new BehaviorSubject({
    name: 'Walter',
    age: 43,
  });
  age$ = this.user$.pipe(
    tap((data) => console.log('obs', data)),
    map((u) => u.age)
  );

  user = signal<IUser>({
    name: 'Walter',
    age: 43,
  });

  e = effect(() => {
    const user = this.user();
    console.log('signal', user);
  });

  age = computed(() => this.user().age);

  plus() {
    this.user.update((u) => ({ ...u, age: u.age + 1 }));
    this.user.update((u) => ({ ...u, name: u.name + 1 }));
    const u = this.user$.getValue();
    this.user$.next({ ...u, age: u.age + 1 });
    this.user$.next({ ...u, name: u.name + 1 });
  }

  rep = new ReplaySubject(1);
  beh = new BehaviorSubject(7);
  ngOnInit(): void {
    console.log('OnInit');

    // this.rep.next(7);
    // this.rep.complete();
    // this.beh.complete();

    // this.rep.subscribe((n) => console.log('rep', n));
    // this.beh.subscribe((n) => console.log('beh', n));
  }
}
