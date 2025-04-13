import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('offer')
export class Offer {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'device_id', type: 'varchar' })
	deviceId: string;

	@Column({ name: 'start_station', type: 'varchar' })
	startStation: string;

	@Column({ name: 'end_station', type: 'varchar' })
	endStation: string;

	@Column({ name: 'departure_date', type: 'varchar' })
	departureDate: string;

	@Column({ type: 'varchar' })
	before: string;

	@Column({ type: 'varchar' })
	after: string;

	@Column({ type: 'boolean', default: true })
	offersByCity: boolean;

	@Column({ name: 'contact_method', type: 'varchar', length: 100 })
	contactMethod: string;
}