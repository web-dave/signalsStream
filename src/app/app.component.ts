import { Component, computed, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserCardComponent } from './user-card/user-card.component';
import { BehaviorSubject, combineLatest, debounceTime, tap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserCardComponent, JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  show = true;
  name$ = new BehaviorSubject('Waltraut');
  age$ = new BehaviorSubject(42);

  user$ = combineLatest({
    name: this.name$,
    age: this.age$,
  }).pipe(
    debounceTime(0),
    tap((data) => console.log('obs', data))
  );

  name = signal('Waltraut');
  age = signal(42);

  user = computed(() => ({
    name: this.name(),
    age: this.age(),
  }));
  e = effect(() => {
    const user = this.user();
    console.log('signal', user);
  });

  plus() {
    const n = this.name$.getValue();
    const a = this.age$.getValue();
    this.name$.next(n + 1);
    this.age$.next(a + 1);

    this.name.update((n) => n + 1);
    this.age.update((a) => a + 1);
  }
}
