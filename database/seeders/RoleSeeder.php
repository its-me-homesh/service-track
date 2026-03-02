<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = ['Admin', 'Technician', 'Operator'];

        foreach ($roles as $roleName) {
            $role = \Spatie\Permission\Models\Role::updateOrCreate(['name' => $roleName]);
            if ($roleName == 'Admin') {
                $role->givePermissionTo(Permission::pluck('id'));
            }
        }
    }
}
