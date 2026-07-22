import type { Clock } from '@hha/foundation';

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogContext = Readonly<Record<string, unknown>>;

export interface LogRecord {
  readonly level: LogLevel;
  readonly message: string;
  readonly timestamp: string;
  readonly context?: LogContext;
}

export interface LogSink {
  write(record: LogRecord): void;
}

export class StructuredLogger {
  public constructor(
    private readonly clock: Clock,
    private readonly sink: LogSink,
  ) {}

  log(level: LogLevel, message: string, context?: LogContext): void {
    this.sink.write({
      level,
      message,
      timestamp: this.clock.now(),
      ...(context ? { context } : {}),
    });
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }
}

export class MemoryLogSink implements LogSink {
  readonly records: LogRecord[] = [];

  write(record: LogRecord): void {
    this.records.push(record);
  }
}
