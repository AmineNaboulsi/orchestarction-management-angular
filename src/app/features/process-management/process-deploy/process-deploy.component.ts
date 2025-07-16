import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

interface DeploymentRequest {
  deploymentName: string;
  processFileName: string;
  tenantId: string;
  bpmnFile: File;
}

interface DeploymentResponse {
  success: boolean;
  message: string;
  deploymentId?: string;
}

@Component({
  selector: 'app-process-deploy',
  imports: [NgIf,FormsModule],
  templateUrl: './process-deploy.component.html',
  styleUrl: './process-deploy.component.css'
})
export class ProcessDeployComponent {
  deploymentForm = {
    deploymentName: '',
    processFileName: '',
    tenantId: 'FSYS',
    requestId: `req-${Date.now()}`,
    canal: 'web-user'
  };

  selectedFile: File | null = null;
  isLoading = false;
  deploymentResult: DeploymentResponse | null = null;
  errorMessage = '';
  isDragOver = false;

  private apiUrl = 'http://localhost:8095/v1/api/internal/process/deploy';

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFileSelection(target.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFileSelection(event.dataTransfer.files[0]);
    }
  }

  private handleFileSelection(file: File): void {
    this.selectedFile = file;
    this.errorMessage = '';
    
    // Auto-fill processFileName if not already filled
    if (!this.deploymentForm.processFileName) {
      this.deploymentForm.processFileName = file.name;
    }
    
    // Auto-fill deploymentName if not already filled
    if (!this.deploymentForm.deploymentName) {
      const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, '');
      this.deploymentForm.deploymentName = `${nameWithoutExtension}-deployment`;
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.deploymentResult = null;

    const formData = new FormData();
    formData.append('deploymentName', this.deploymentForm.deploymentName);
    formData.append('processFileName', this.deploymentForm.processFileName);
    formData.append('tenantId', this.deploymentForm.tenantId);
    formData.append('bpmnFile', this.selectedFile!);

    const headers = new HttpHeaders({
      'x-api-requestId': this.deploymentForm.requestId,
      'x-api-canal': this.deploymentForm.canal
    });

    this.http.post<DeploymentResponse>(this.apiUrl, formData, { headers })
      .subscribe({
        next: (response) => {
          this.deploymentResult = response;
          this.isLoading = false;
          console.log('Deployment successful:', response);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Deployment failed. Please try again.';
          this.isLoading = false;
          console.error('Deployment error:', error);
        }
      });
  }

  private validateForm(): boolean {
    if (!this.deploymentForm.deploymentName.trim()) {
      this.errorMessage = 'Deployment name is required';
      return false;
    }

    if (!this.deploymentForm.processFileName.trim()) {
      this.errorMessage = 'Process file name is required';
      return false;
    }

    if (!this.deploymentForm.tenantId.trim()) {
      this.errorMessage = 'Tenant ID is required';
      return false;
    }

    if (!this.selectedFile) {
      this.errorMessage = 'Please select a BPMN file';
      return false;
    }

    if (!this.selectedFile.name.toLowerCase().endsWith('.bpmn')) {
      this.errorMessage = 'Please select a valid BPMN file (.bpmn extension)';
      return false;
    }

    return true;
  }

  resetForm(): void {
    this.deploymentForm = {
      deploymentName: '',
      processFileName: '',
      tenantId: 'FSYS',
      requestId: `req-${Date.now()}`,
      canal: 'web-user'
    };
    this.selectedFile = null;
    this.deploymentResult = null;
    this.errorMessage = '';
    
    // Reset file input
    const fileInput = document.getElementById('bpmnFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  generateNewRequestId(): void {
    this.deploymentForm.requestId = `req-${Date.now()}`;
  }

  removeFile(): void {
    this.selectedFile = null;
    const fileInput = document.getElementById('bpmnFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }
}