'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfileAction } from './actions';
import styles from '../subpage.module.css';
import type { UserAccountRecord } from '@/lib/user-profile';
import type { UserProfile } from '@/types';

const TRAVEL_FREQUENCY_OPTIONS = [
    { value: '', label: 'Select frequency' },
    { value: 'rarely', label: 'Rarely' },
    { value: 'yearly', label: 'Once a year' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'monthly', label: 'Monthly' },
];

interface ProfileEditFormProps {
    user: UserAccountRecord;
    profile: UserProfile;
}

export default function ProfileEditForm({ user, profile }: ProfileEditFormProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [formData, setFormData] = useState({
        full_name: user.full_name || '',
        home_city: profile.home_city || '',
        nationality: profile.nationality || 'Indian',
        travel_frequency: profile.travel_frequency || '',
        preferred_currency: profile.preferred_currency || 'INR',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        const result = await updateProfileAction(formData);

        setIsLoading(false);
        if (result.success) {
            setStatus({ type: 'success', message: 'Profile updated successfully!' });
            setIsEditing(false);
            router.refresh();
        } else {
            setStatus({ type: 'error', message: result.error || 'Update failed' });
        }
    };

    if (!isEditing) {
        return (
            <section className={styles.panel}>
                <div className={styles.panelHeader}>
                    <h2 className={styles.panelTitle}>Profile Details</h2>
                    <button 
                        type="button"
                        className={styles.secondaryAction}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Profile
                    </button>
                </div>

                <div className={styles.keyValueList}>
                    <div className={styles.keyValue}>
                        <span className={styles.keyLabel}>Full Name</span>
                        <span>{user.full_name || 'Not set'}</span>
                    </div>
                    <div className={styles.keyValue}>
                        <span className={styles.keyLabel}>Home City</span>
                        <span>{profile.home_city || 'Not set'}</span>
                    </div>
                    <div className={styles.keyValue}>
                        <span className={styles.keyLabel}>Nationality</span>
                        <span>{profile.nationality}</span>
                    </div>
                    <div className={styles.keyValue}>
                        <span className={styles.keyLabel}>Preferred Currency</span>
                        <span>{profile.preferred_currency}</span>
                    </div>
                    <div className={styles.keyValue}>
                        <span className={styles.keyLabel}>Travel Frequency</span>
                        <span>{profile.travel_frequency || 'Not set'}</span>
                    </div>
                </div>
                
                {status?.type === 'success' && (
                    <p className={`${styles.status} ${styles.statusSuccess}`} style={{ marginTop: '16px' }}>
                        {status.message}
                    </p>
                )}
            </section>
        );
    }

    return (
        <section className={styles.panel}>
            <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Edit Profile</h2>
            </div>

            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                    <div className={styles.field}>
                        <label className={styles.label}>Full Name</label>
                        <input
                            type="text"
                            name="full_name"
                            className={styles.input}
                            value={formData.full_name}
                            onChange={handleChange}
                            placeholder="Your full name"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Home City</label>
                        <input
                            type="text"
                            name="home_city"
                            className={styles.input}
                            value={formData.home_city}
                            onChange={handleChange}
                            placeholder="e.g. Mumbai, India"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Nationality</label>
                        <input
                            type="text"
                            name="nationality"
                            className={styles.input}
                            value={formData.nationality}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Preferred Currency</label>
                        <select
                            name="preferred_currency"
                            className={styles.select}
                            value={formData.preferred_currency}
                            onChange={handleChange}
                        >
                            <option value="INR">INR - Indian Rupee</option>
                            <option value="USD">USD - US Dollar</option>
                            <option value="EUR">EUR - Euro</option>
                            <option value="GBP">GBP - British Pound</option>
                        </select>
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label}>Travel Frequency</label>
                        <select
                            name="travel_frequency"
                            className={styles.select}
                            value={formData.travel_frequency}
                            onChange={handleChange}
                        >
                            {TRAVEL_FREQUENCY_OPTIONS.map((option) => (
                                <option key={option.value || 'blank'} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formFooter}>
                    {status?.type === 'error' && (
                        <p className={`${styles.status} ${styles.statusError}`}>{status.message}</p>
                    )}
                    <div className={styles.actions} style={{ marginLeft: 'auto' }}>
                        <button 
                            type="button" 
                            className={styles.secondaryAction}
                            onClick={() => {
                                setIsEditing(false);
                                setStatus(null);
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className={styles.primaryAction}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
}
