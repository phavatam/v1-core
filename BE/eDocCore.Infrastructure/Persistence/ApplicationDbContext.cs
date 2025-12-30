using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using eDocCore.Domain.Entities;

namespace eDocCore.Infrastructure.Persistence;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext()
    {
    }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=.;Database=eDocCoreDB;User Id=sa;Password=Matkhau1;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>(entity =>
        {
            // Let the database generate Guid by default when inserting a new user via migrations (NEWID()).
            //entity.Property(e => e.Id)
            //    .ValueGeneratedOnAdd()
            //    .HasDefaultValueSql("NEWID()");
            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.FullName).HasMaxLength(255);
            entity.Property(e => e.LoginName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Version)
                .IsRowVersion()
                .IsConcurrencyToken();
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
