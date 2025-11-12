import { Component, OnInit } from '@angular/core';
import { LogService, Log } from '../log.service';
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logs',
  standalone: true,
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss'],
  imports: [CommonModule],
})
export class LogsComponent implements OnInit {
  logs: Log[] = [];

  constructor(private logService: LogService) {}

  ngOnInit(): void {
    this.logService.getLogs().subscribe({
      next: (data) => {
        console.log('Logs reçus:', data);
        this.logs = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des logs', err);
      }
    });
  }
}
